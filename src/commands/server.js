import chalk from 'chalk'
import http from 'http'
import https from 'https'
import mime from 'mime'
import url from 'url'
import querystring from 'querystring';
import assign from 'deep-assign'
import sleep from 'thread-sleep';

import * as fsp from '../utils/fs.js'
import * as path from '../utils/path.js'
import * as Mock from '../utils/mock.js'

const rType = /\.(\w+)$/i;

const loadMockTpl = function (tpl) {
  try {
    let mock = fsp.readFileSync(tpl);
    return mock;
  } catch (e) {
    return null;
  }
}

/**
 * 将mock中的@GET['id'],@POST['pwd'],@REST['user']替换为对应的请求参数。
 */
const AnalyserRequestPlaceholder = function(mockTpl, reqArg) {
  if(!mockTpl) {
    return null;
  }
  mockTpl = mockTpl.replace(/\\*@(GET|POST|REST)(?:\[(.*?)\])?/g,function(s){
    s = s.replace(/^@/,'.');
    return eval(`reqArg${s}||''`);
  });
  return mockTpl;
}

const _mockData = function(tplPath, request, response, body, config, options, callback) {

  let mockTpl = loadMockTpl(tplPath);

  let urlObject = url.parse(request.url);
  let GET = querystring.parse(urlObject.query);
  let POST = querystring.parse(body);
  let REST = {};

  if(options.log) {
    GET && console.log("GET：",GET);
    POST && console.log("POST：",POST);
  }

  mockTpl = AnalyserRequestPlaceholder(mockTpl,{GET, POST, REST});

  let data, mock = eval(`mock = ${mockTpl}`);

  if (mock) {
    try {
      data = Mock.mock(mock);
      let jsoncallback = GET['callback'] || GET['jsoncallback'];

      if (jsoncallback) {
        callback(`${jsoncallback}(${JSON.stringify(data)})`);
      } else {
        callback(JSON.stringify(data));
      }
    } catch (e) {
      callback(null, 502, e);
    }
  } else {
    callback(null, 502, new Error('mock tpl not found'));
  }
}

const mockData = function (request, response, config, options, callback) {

  let urlObject = url.parse(request.url);
  let pathname = path.join(urlObject.pathname); // 去掉多余的 / 如：http://api.example.com//test/deep//path
  let headers = request.headers;
  let host = headers.host;

  let tplPath;

  if (config) {

    config.mock.some(function (mock) {
      if (mock.pathname == pathname) {
        tplPath = path.join(process.cwd(), mock.tpl);
        if(mock.delay > 0 && !isNaN(mock.delay)) {
          sleep(parseInt(mock.delay));
        }
        if(mock.statusCode &&  mock.statusCode!== 200) {
          callback(null, mock.statusCode);
        }
      }
    });

    if (!tplPath && config.ip) {
      proxyToSourceServer(request, response, config, options, callback);
      return;
    }

  } else {
    tplPath = path.join(process.cwd(), `${pathname}.mock`);
  }

  let body = [];
  request.on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();
    _mockData(tplPath, request, response, body, config, options, callback);
  });
}

const proxyToSourceServer = function (request, response, config, options, callback) {
  proxyHttp(request, response, config, options, callback);
}

const proxyHttp = function (request, response, config, options, callback) {
  let opt = {
    host: config.ip,
    port: config.port || "80",
    method: request.method,
    path: request.url,
    headers: request.headers
  }

  let body = [];
  request.on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();
    if(options.log) {
      let urlObject = url.parse(request.url);
      let GET = querystring.parse(urlObject.query);
      let POST = querystring.parse(body);

      GET && console.log("GET：",GET);
      POST && console.log("POST：",POST);
    }
  });

  console.log(chalk.green(`Proxy to ${opt.host}:${opt.port}`));

  //以下是接受数据的代码
  let resBody = '';
  let req = http.request(opt, function (res) {
    res.pipe(response);
    response.writeHeader(res.statusCode, res.headers);

    console.log("Got response: " + res.statusCode);
    res.on('data', function (d) {
      resBody += d;
    }).on('end', function () {
      callback(resBody, res.statusCode, null, true);
    });
  }).on('error', function (e) {
    callback(null, 502, e);
  });

  if (/POST|PUT/i.test(request.method)) {
    request.pipe(req);
  } else {
    req.end();
  }
}

const output = function (code, data, request, response, pathname) {
  if (data) {
    response.writeHeader(code, {
      'content-type': (pathname.match(rType) ? mime.lookup(pathname) : mime.lookup('json')) + ';charset=utf-8',
      'Access-Control-Allow-Origin': "*"
    });
    response.end(data);

  } else {
    response.writeHeader(code,{
      'Access-Control-Allow-Origin': "*"
    });
    response.end();
  }
};

const onRequest = function (request, response, options, config) {

  let pathname = url.parse(request.url).pathname;
  let host = request.headers.host;

  // console.log(request._secure, request.connection.encrypted);

  console.log(chalk.bold.green('REQ:') + ' http://' + host + pathname);

  mockData(request, response, config, options, function (fileData, statusCode, err, isProxy) {
    if (isProxy) {
      response.end(fileData);
    }
    if (err) {
      console.error(chalk.bold.white.bgRed(' ERROR '));
      //err.some(function (_err) {
        console.error(err);
      //});

      if (fileData) {
        output(502, null, request, response, pathname);
      } else {
        output(404, null, request, response, pathname);
      }

    } else {
      output(statusCode || 200, fileData, request, response, pathname);
    }
  });
}


const startServer = function (options, config) {

  let server = http.createServer();

  server.on('listening', function (err) {
    if (err) {
      console.error(chalk.red('http-mock服务启动失败'));
    } else {
      console.log('启动成功，监听端口： %s', options.port);
    }
  });

  server.on('request', function (request, response) {
    let dirname = process.cwd();
    let configFile = 'mock.json';
    if(options.config) {
      configFile = options.config;
    }
    let config = fsp.readJSONSync(path.join(dirname, configFile));

    onRequest(request, response, options, config);
  });

  server.listen(options.port);
}

export default function (options) {
  startServer(options);
}
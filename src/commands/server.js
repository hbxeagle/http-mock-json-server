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
import path2mock from './path2mock.js'

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

const _mockData = function(tplPath, mockConfig, options, callback) {

  let mockTpl = loadMockTpl(tplPath);

  let {GET, POST, REST} = mockConfig;

  if(options.log) {
    GET && console.log("GET：",GET);
    POST && console.log("POST：",POST);
    REST && console.log("POST：",REST);
  }

  mockTpl = AnalyserRequestPlaceholder(mockTpl,{GET, POST, REST});

  try {
    let data, mock = eval(`mock = ${mockTpl}`);
    if (mock) {
        data = Mock.mock(mock);
        let jsoncallback = GET['callback'] || GET['jsoncallback'];

        if (jsoncallback) {
          callback(`${jsoncallback}(${JSON.stringify(data)})`, 200, null, false, mockConfig);
        } else {
          callback(JSON.stringify(data), 200, null, false, mockConfig);
        }
    } else {
      callback(null, 502, new Error('mock tpl not found'), false, mockConfig);
    }
  } catch (e) {
    callback(null, 502, e, false, mockConfig);
  }
}

const mockData = function (request, response, config, options, callback) {

  let body = [];
  request.on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();

    let tplPath;
    let mockConfig = path2mock(request, body, config ? config.mock : []);

    if (config) {
      if(mockConfig.tpl) {
        tplPath = path.join(process.cwd(), mockConfig.tpl);
        if(mockConfig.delay > 0 && !isNaN(mockConfig.delay)) {
          sleep(parseInt(mockConfig.delay));
        }
        if(mockConfig.statusCode &&  mockConfig.statusCode!== 200) {
          callback(null, mockConfig.statusCode, null, false, mockConfig);
        }
      }

      if (!tplPath && config.ip) {
        proxyToSourceServer(request, response, config, options, mockConfig, callback);
        return;
      }

    } else {
      tplPath = path.join(process.cwd(), `${pathname}.mock`);
    }

    _mockData(tplPath, mockConfig, options, callback);
  });
}

const proxyToSourceServer = function (request, response, config, options, mockConfig, callback) {
  proxyHttp(request, response, config, options, mockConfig, callback);
}

const proxyHttp = function (request, response, config, options, mockConfig, callback) {
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
      callback(resBody, res.statusCode, null, true, mockConfig);
    });
  }).on('error', function (e) {
    callback(null, 502, e, false, mockConfig);
  });

  if (/POST|PUT/i.test(request.method)) {
    request.pipe(req);
  } else {
    req.end();
  }
}

const output = function (code, data, request, response, pathname, mockConfig) {
  if (data) {
    console.log('-----------', mockConfig);
    const contentType = mockConfig.contentType 
      ? mockConfig.contentType
      : (pathname.match(rType)
        ? mime.lookup(pathname)
        : mime.lookup('json')) + ';charset=utf-8';

    response.writeHeader(code, {
      'content-type': contentType,
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

  mockData(request, response, config, options, function (fileData, statusCode, err, isProxy, mockConfig) {
    if (isProxy) {
      response.end(fileData);
    }
    if (err) {
      console.error(chalk.bold.white.bgRed(' ERROR '));
      //err.some(function (_err) {
        console.error(err);
      //});

      if (fileData) {
        output(502, null, request, response, pathname, mockConfig);
      } else {
        output(404, null, request, response, pathname, mockConfig);
      }

    } else {
      output(statusCode || 200, fileData, request, response, pathname, mockConfig);
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
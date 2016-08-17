import chalk from 'chalk'
import http from 'http'
import mime from 'mime'
import url from 'url'
import querystring from 'querystring';
import assign from 'deep-assign'

import * as fsp from '../utils/fs.js'
import * as path from '../utils/path.js'
import * as Mock from '../utils/mock.js'

const rType = /\.(\w+)$/i;

const loadMockTpl = function (tpl) {
  try{
    let mock = fsp.readFileSync(tpl);
    return mock;
  } catch(e) {
    return null;
  }
}

const mockData = function (request, response, config, callback) {

  let urlObject = url.parse(request.url);
  let pathname = urlObject.pathname;

  let data, tpl, mock;

  if (config) {
    config.mock.some(function (mock) {
      if (mock.pathname == pathname) {
        tpl = `${process.cwd()}/${mock.tpl}`;
      }
    });
    mock = loadMockTpl(tpl);
    if (!mock && config.ip ) {
      proxyToSourceServer(request, response, config, callback);
      return;
    }
  } else {
    tpl = `${process.cwd()}/${pathname}.mock`;
  }

  mock = eval(`mock = ${loadMockTpl(tpl)}`);

  if(mock){
    try{
      data = Mock.mock(mock);
      let query = querystring.parse(urlObject.query);
      let jsoncallback = query['callback'] || query['jsoncallback'];

      if(jsoncallback) {
        callback(`${jsoncallback}(${JSON.stringify(data)})`);
      } else {
        callback(JSON.stringify(data));
      }
    } catch(e) {
      callback(null, [e]);
    }
  } else {
    callback(null, [new Error('mock tpl not found')]);
  }
}

const proxyToSourceServer = function (request, response, config, callback) {
  let opt = {
    host: config.ip,
    port: config.port || "80",
    method: request.method,
    path: request.url,
    headers: request.headers
  }
  //以下是接受数据的代码
  let body = '';
  let req = http.request(opt, function (res) {
    res.pipe(response);
    response.writeHeader(res.statusCode, res.headers);

    console.log("Got response: " + res.statusCode);
    res.on('data', function (d) {
      body += d;
    }).on('end', function () {
      callback(body, null, true);
    });
  }).on('error', function (e) {
    callback(null, [e]);
  })
  req.end();
}

const output = function (code, data, request, response, pathname) {
  if (data) {
    response.writeHeader(code, {
      'content-type': (pathname.match(rType) ? mime.lookup(pathname) : mime.lookup('json')) + ';charset=utf-8',
      'Access-Control-Allow-Origin':"*"
    });
    response.end(data);

  } else {
    response.writeHeader(code);
    response.end();
  }
};

const onRequest = function (request, response, options, config) {

  let pathname = url.parse(request.url).pathname;
  let host = request.headers.host;

  console.log(chalk.bold.green('GET:') + ' http://' + host + pathname);
  mockData(request, response, config, function (fileData, err, isProxy) {
    if (isProxy) {
      response.end(fileData);
    }
    if (err) {
      console.error(chalk.bold.white.bgRed(' ERROR '));
      err.some(function (_err) {
        console.error(_err);
      });

      if (fileData) {
        output(502, null, request, response, pathname);
      } else {
        output(404, null, request, response, pathname);
      }

    } else {
      output(200, fileData, request, response, pathname);
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
    onRequest(request, response, options, config);
  });

  server.listen(options.port);
}

export default function (options, config) {
  startServer(options, config);
}
import url from 'url'
import querystring from 'querystring';
import sleep from 'thread-sleep';

import * as path from '../utils/path.js'

const rRest = /\{[^}]*\}/g;

export default function (request, body, mocks) {
  let urlObject = url.parse(request.url);
  let pathname = path.join(urlObject.pathname); // 去掉多余的反斜杠 / 如：http://api.example.com//test/deep//path
  let headers = request.headers;
  let host = headers.host;
  let GET = querystring.parse(urlObject.query);
  let POST = querystring.parse(body);
  let REST = {};
  let _mock = {};

  mocks && mocks.some(function (mock) {
    if (mock.pathname == pathname) {
      if (mock.apiKey) {
        let apiKey = mock.apiKey.split('=');
        if (GET[apiKey[0]] == apiKey[1] || POST[apiKey[0]] == apiKey[1]) {
          _mock = mock;
        }
      } else {
        _mock = mock;
      }
    } else {
      let rest = mock.pathname.match(rRest);
      let _match = mock.pathname;
      if (rest) {
        rest.some(function(v){
          _match = _match.replace(v, '([^/]*)');
        });
        let _rest = pathname.match(new RegExp(_match));
        if(_rest) {
          _rest.shift();
          if(_rest) {
            rest.some(function(v,i){
              REST[v.replace(/[\{|\}]/g, "")] = _rest[i];
            });
            if (mock.apiKey) {
              let apiKey = mock.apiKey.split('=');
              if (REST[apiKey[0]] == apiKey[1]) {
                _mock = mock;
              }
            } else {
              _mock = mock;
            }
          }
        }
      }
    }
  });

  _mock.GET = GET;
  _mock.POST = POST;
  _mock.REST = REST;
  return _mock;
}
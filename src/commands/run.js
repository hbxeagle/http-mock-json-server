import * as fsp from '../utils/fs.js'
import * as path from '../utils/path.js'

import server from './server.js'

let stream = process.stdout;
let loadding = ['|', '/', '-', '\\'];
let _i = 0;
if (stream && stream.cursorTo) {
  stream.cursorTo(0);
  stream.write(loadding[_i]);
  stream.cursorTo(0);
  _i++;
  _i = _i % loadding.length;
}
global.timer = setInterval(function () {
  if (stream && stream.cursorTo) {
    stream.cursorTo(0);
    stream.write(loadding[_i]);
    stream.cursorTo(0);
    _i++;
    _i = _i % loadding.length;
  }
}, 50);

export default function (options) {
  console.log('正在启动 http-mockjs 模拟数据服务器...');

  options.port = options.port || 7071;
  let dirname = process.cwd();

  let config = fsp.readJSONSync(path.join(dirname, 'mock.json'));

  server(options, config);
}
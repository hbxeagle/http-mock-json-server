import program from 'commander'

import * as pkg from '../../package.json'
import run from '../commands/run'

program
  .version(pkg.version)
  .option('-p, --port [value]','监听端口')
  .description('开启 http mock server')
  .parse(process.argv);

  run(program);

export default program
var assert = require('chai').assert;
var path2mock = require('../dist/commands/path2mock.js').default;

var mocks = {
  "host": "http://api.example.com/",
  "ip": "127.0.0.1",
  "port": "8080",
  "mock": [{
      "pathname": "/rest/get/{pi}-{pz}",
      "tpl": "/rest/get/{pi}-{pz}.mock",
      "statusCode": 200,
      "delay": 0
    }, {
      "pathname": "/rest/{method}/{pi}-{pz}",
      "tpl": "/rest/{method}/{pi}-{pz}.mock",
      "statusCode": 200,
      "delay": 0
    }, {
      "pathname": "/rest/get/{method}/{pi}-{pz}",
      "tpl": "/rest/get/{method}/{pi}-{pz}.mock",
      "statusCode": 200,
      "delay": 0
    }, 
    
    {
      "pathname": "/rest/get",
      "tpl": "/rest/get.mock",
      "statusCode": 200,
      "delay": 0
    }, {
      "pathname": "/rest/get/list",
      "tpl": "/rest/get/list.mock",
      "statusCode": 200,
      "delay": 0
    }, {
      "pathname": "/rest/get/detail",
      "tpl": "/rest/get/detail.mock",
      "statusCode": 200,
      "delay": 0
    },

    {
      "pathname": "/rest",
      "tpl": "/rest/method.get.mock",
      "apiKey":"method=get",
      "statusCode": 200,
      "delay": 0
    }, {
      "pathname": "/rest/get",
      "tpl": "/rest/get/method.list.mock",
      "apiKey":"method=list",
      "statusCode": 200,
      "delay": 0
    }, {
      "pathname": "/rest/get",
      "tpl": "/rest/get/method.detail.mock",
      "apiKey":"method=detail",
      "statusCode": 200,
      "delay": 0
    },

    {
      "pathname": "/rest/ddd/{pi}-{pz}",
      "tpl": "/rest/ddd/{pi}-{pz}.mock",
      "statusCode": 200,
      "delay": 0
    }, {
      "pathname": "/rest/ddd/{method}/{pi}-{pz}",
      "tpl": "/rest/get/{method}/{pi}-{pz}.mock",
      "statusCode": 200,
      "delay": 0
    }, 
    
    {
      "pathname": "/rest/ddd",
      "tpl": "/rest/ddd.mock",
      "statusCode": 200,
      "delay": 0
    }, {
      "pathname": "/rest/ddd/list",
      "tpl": "/rest/ddd/list.mock",
      "statusCode": 200,
      "delay": 0
    }, {
      "pathname": "/rest/ddd/detail",
      "tpl": "/rest/get/detail.mock",
      "statusCode": 200,
      "delay": 0
    },

    {
      "pathname": "/rest",
      "tpl": "/rest/method.ddd.mock",
      "apiKey":"method=ddd",
      "statusCode": 200,
      "delay": 0
    }, {
      "pathname": "/rest/ddd",
      "tpl": "/rest/ddd/method.list.mock",
      "apiKey":"method=list",
      "statusCode": 200,
      "delay": 0
    }, {
      "pathname": "/rest/ddd",
      "tpl": "/rest/ddd/method.detail.mock",
      "apiKey":"method=detail",
      "statusCode": 200,
      "delay": 0
    },

    // 111
    {
      "pathname": "/rest/111/{pi}-{pz}",
      "tpl": "/rest/111/{pi}-{pz}.mock",
      "statusCode": 200,
      "delay": 0
    }, {
      "pathname": "/rest/111/{method}/{pi}-{pz}",
      "tpl": "/rest/get/{method}/{pi}-{pz}.mock",
      "statusCode": 200,
      "delay": 0
    }, 
    
    {
      "pathname": "/rest/111",
      "tpl": "/rest/111.mock",
      "statusCode": 200,
      "delay": 0
    }, {
      "pathname": "/rest/111/list",
      "tpl": "/rest/111/list.mock",
      "statusCode": 200,
      "delay": 0
    }, {
      "pathname": "/rest/111/detail",
      "tpl": "/rest/get/detail.mock",
      "statusCode": 200,
      "delay": 0
    },

    {
      "pathname": "/rest",
      "tpl": "/rest/method.111.mock",
      "apiKey":"method=111",
      "statusCode": 200,
      "delay": 0
    }, {
      "pathname": "/rest/111",
      "tpl": "/rest/111/method.list.mock",
      "apiKey":"method=list",
      "statusCode": 200,
      "delay": 0
    }, {
      "pathname": "/rest/111",
      "tpl": "/rest/111/method.detail.mock",
      "apiKey":"method=detail",
      "statusCode": 200,
      "delay": 0
    }
    
    ]
}

describe('path2mock', function() {
  var tests = [
    "/rest/get/1-2",
    "/rest/get/list/1-2",
    "/rest/get/detail/1",

    "/rest/get?pi=1&pz=2",
    "/rest/get/list?pi=1&pz=2",
    "/rest/get/detail?id=1",

    "/rest?method=get&pi=1&pz=2",
    "/rest/get?method=list&pi=1&pz=2",
    "/rest/get?method=detail&pi=1&pz=2",


    "/rest/get2/1-2",
    "/rest/get2/list/1-2",
    "/rest/get2/detail/1",

    "/rest/get2?pi=1&pz=2",
    "/rest/get2/list?pi=1&pz=2",
    "/rest/get2/detail?id=1",

    "/rest?method=get2&pi=1&pz=2",
    "/rest/get2?method=list&pi=1&pz=2",
    "/rest/get2?method=detail&pi=1&pz=2",


    "/rest/ddd/1-2",
    "/rest/ddd/list/1-2",
    "/rest/ddd/detail/1",

    "/rest/ddd?pi=1&pz=2",
    "/rest/ddd/list?pi=1&pz=2",
    "/rest/ddd/detail?id=1",

    "/rest?method=ddd&pi=1&pz=2",
    "/rest/ddd?method=list&pi=1&pz=2",
    "/rest/ddd?method=detail&pi=1&pz=2",


    "/rest/dddd/1-2",
    "/rest/dddd/list/1-2",
    "/rest/dddd/detail/1",

    "/rest/dddd?pi=1&pz=2",
    "/rest/dddd/list?pi=1&pz=2",
    "/rest/dddd/detail?id=1",

    "/rest?method=dddd&pi=1&pz=2",
    "/rest/dddd?method=list&pi=1&pz=2",
    "/rest/dddd?method=detail&pi=1&pz=2",


    "/rest/111/1-2",
    "/rest/111/list/1-2",
    "/rest/111/detail/1",

    "/rest/111?pi=1&pz=2",
    "/rest/111/list?pi=1&pz=2",
    "/rest/111/detail?id=1",

    "/rest?method=111&pi=1&pz=2",
    "/rest/111?method=list&pi=1&pz=2",
    "/rest/111?method=detail&pi=1&pz=2",


    "/rest/1111/1-2",
    "/rest/1111/list/1-2",
    "/rest/1111/detail/1",

    "/rest/1111?pi=1&pz=2",
    "/rest/1111/list?pi=1&pz=2",
    "/rest/1111/detail?id=1",

    "/rest?method=1111&pi=1&pz=2",
    "/rest/1111?method=list&pi=1&pz=2",
    "/rest/1111?method=detail&pi=1&pz=2"
  ];

  tests.forEach(function(test) {
    it('test request path ' + test + ' :', function() {
      // var res = add.apply(null, test.args);
      // assert.equal(res, test.expected);
      console.log(path2mock({url:test,headers:{host:"api.example.com"}}, {}, mocks.mock));
    });
  });
});
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
  }, {
    "pathname": "/rest/get/{method}/{pi}-{pz}",
    "tpl": "/rest/get/{method}/{pi}-{pz}.list.mock",
    "apiKey": "method=list",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/get/{method}/{pi}-{pz}",
    "tpl": "/rest/get/{method}/{pi}-{pz}.list.mock",
    "apiKey": "method=list2",
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
    "apiKey": "method=get",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/get",
    "tpl": "/rest/get/method.list.mock",
    "apiKey": "method=list",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/get",
    "tpl": "/rest/get/method.detail.mock",
    "apiKey": "method=detail",
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
    "tpl": "/rest/ddd/{method}/{pi}-{pz}.mock",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/ddd/{method}/{pi}-{pz}",
    "tpl": "/rest/ddd/{method}/{pi}-{pz}.list.mock",
    "apiKey": "method=list",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/ddd/{method}/{pi}-{pz}",
    "tpl": "/rest/ddd/{method}/{pi}-{pz}.list.mock",
    "apiKey": "method=list2",
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
    "tpl": "/rest/ddd/detail.mock",
    "statusCode": 200,
    "delay": 0
  },

  {
    "pathname": "/rest",
    "tpl": "/rest/method.ddd.mock",
    "apiKey": "method=ddd",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/ddd",
    "tpl": "/rest/ddd/method.list.mock",
    "apiKey": "method=list",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/ddd",
    "tpl": "/rest/ddd/method.detail.mock",
    "apiKey": "method=detail",
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
    "tpl": "/rest/111/{method}/{pi}-{pz}.mock",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/111/{method}/{pi}-{pz}",
    "tpl": "/rest/111/{method}/{pi}-{pz}.list.mock",
    "apiKey" : "method=list",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/111/{method}/{pi}-{pz}",
    "tpl": "/rest/111/{method}/{pi}-{pz}.list2.mock",
    "apiKey" : "method=list2",
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
    "tpl": "/rest/111/detail.mock",
    "statusCode": 200,
    "delay": 0
  },

  {
    "pathname": "/rest",
    "tpl": "/rest/method.111.mock",
    "apiKey": "method=111",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/111",
    "tpl": "/rest/111/method.list.mock",
    "apiKey": "method=list",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/111",
    "tpl": "/rest/111/method.detail.mock",
    "apiKey": "method=detail",
    "statusCode": 200,
    "delay": 0
  },

  // 测试
  {
    "pathname": "/rest/测试/{pi}-{pz}",
    "tpl": "/rest/测试/{pi}-{pz}.mock",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/测试/{method}/{pi}-{pz}",
    "tpl": "/rest/测试/{method}/{pi}-{pz}.mock",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/测试/{method}/{pi}-{pz}",
    "tpl": "/rest/测试/{method}/{pi}-{pz}.list.mock",
    "apiKey": "method=list",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/测试/{method}/{pi}-{pz}",
    "tpl": "/rest/测试/{method}/{pi}-{pz}.list2.mock",
    "apiKey": "method=list2",
    "statusCode": 200,
    "delay": 0
  },

  {
    "pathname": "/rest/测试",
    "tpl": "/rest/测试.mock",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/测试/list",
    "tpl": "/rest/测试/list.mock",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/测试/detail",
    "tpl": "/rest/测试/detail.mock",
    "statusCode": 200,
    "delay": 0
  },

  {
    "pathname": "/rest",
    "tpl": "/rest/method.测试.mock",
    "apiKey": "method=测试",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/测试",
    "tpl": "/rest/测试/method.list.mock",
    "apiKey": "method=list",
    "statusCode": 200,
    "delay": 0
  }, {
    "pathname": "/rest/测试",
    "tpl": "/rest/测试/method.detail.mock",
    "apiKey": "method=detail",
    "statusCode": 200,
    "delay": 0
  }

  ]
}

describe('path2mock', function () {
  var tests = [
    {
      key: "/rest/get/1-2",
      match: {
        pathname: '/rest/{method}/{pi}-{pz}',
        tpl: '/rest/{method}/{pi}-{pz}.mock',
        statusCode: 200,
        delay: 0,
        GET: {},
        POST: {},
        REST: { pi: '1', pz: '2', method: 'get' }
      }
    },
    {
      key: "/rest/get/list/1-2",
      match: {
        pathname: '/rest/get/{method}/{pi}-{pz}',
        tpl: '/rest/get/{method}/{pi}-{pz}.list.mock',
        statusCode: 200,
        delay: 0,
        GET: {},
        POST: {},
        REST: { method: 'list', pi: '1', pz: '2' }
      }
    },
    {
      key: "/rest/get/detail/1",
      match: { GET: {}, POST: {}, REST: {} }
    },

    {
      key: "/rest/get?pi=1&pz=2",
      match: {
        pathname: '/rest/get',
        tpl: '/rest/get.mock',
        statusCode: 200,
        delay: 0,
        GET: { pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
    {
      key: "/rest/get/list?pi=1&pz=2",
      match: {
        pathname: '/rest/get/list',
        tpl: '/rest/get/list.mock',
        statusCode: 200,
        delay: 0,
        GET: { pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
    {
      key: "/rest/get/detail?id=1",
      match: {
        pathname: '/rest/get/detail',
        tpl: '/rest/get/detail.mock',
        statusCode: 200,
        delay: 0,
        GET: { id: '1' },
        POST: {},
        REST: {}
      }
    },

    {
      key: "/rest?method=get&pi=1&pz=2",
      match: {
        pathname: '/rest',
        tpl: '/rest/method.get.mock',
        apiKey: 'method=get',
        statusCode: 200,
        delay: 0,
        GET: { method: 'get', pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
    {
      key: "/rest/get?method=list&pi=1&pz=2",
      match: {
        pathname: '/rest/get',
        tpl: '/rest/get/method.list.mock',
        apiKey: 'method=list',
        statusCode: 200,
        delay: 0,
        GET: { method: 'list', pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
    {
      key: "/rest/get?method=detail&pi=1&pz=2",
      match: {
        pathname: '/rest/get',
        tpl: '/rest/get/method.detail.mock',
        apiKey: 'method=detail',
        statusCode: 200,
        delay: 0,
        GET: { method: 'detail', pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },



    {
      key: "/rest/get2/1-2",
      match: {
        pathname: '/rest/{method}/{pi}-{pz}',
        tpl: '/rest/{method}/{pi}-{pz}.mock',
        statusCode: 200,
        delay: 0,
        GET: {},
        POST: {},
        REST: { method: 'get2', pi: '1', pz: '2' }
      }
    },
    {
      key: "/rest/get2/list/1-2",
      match: { GET: {}, POST: {}, REST: {} }
    },
    {
      key: "/rest/get2/detail/1",
      match: { GET: {}, POST: {}, REST: {} }
    },

    {
      key: "/rest/get2?pi=1&pz=2",
      match: { GET: { pi: '1', pz: '2' }, POST: {}, REST: {} }
    },
    {
      key: "/rest/get2/list?pi=1&pz=2",
      match: { GET: { pi: '1', pz: '2' }, POST: {}, REST: {} }
    },
    {
      key: "/rest/get2/detail?id=1",
      match: { GET: { id: '1' }, POST: {}, REST: {} }
    },

    {
      key: "/rest?method=get2&pi=1&pz=2",
      match: { GET: { method: 'get2', pi: '1', pz: '2' }, POST: {}, REST: {} }
    },
    {
      key: "/rest/get2?method=list&pi=1&pz=2",
      match: { GET: { method: 'list', pi: '1', pz: '2' }, POST: {}, REST: {} }
    },
    {
      key: "/rest/get2?method=detail&pi=1&pz=2",
      match: {
        GET: { method: 'detail', pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },



    {
      key: "/rest/ddd/1-2",
      match: {
        pathname: '/rest/ddd/{pi}-{pz}',
        tpl: '/rest/ddd/{pi}-{pz}.mock',
        statusCode: 200,
        delay: 0,
        GET: {},
        POST: {},
        REST: { method: 'ddd', pi: '1', pz: '2' }
      }
    },
    {
      key: "/rest/ddd/list/1-2",
      match: {
        pathname: '/rest/ddd/{method}/{pi}-{pz}',
        tpl: '/rest/ddd/{method}/{pi}-{pz}.list.mock',
        statusCode: 200,
        delay: 0,
        GET: {},
        POST: {},
        REST: { method: 'list', pi: '1', pz: '2' }
      }
    },
    {
      key: "/rest/ddd/detail/1",
      match: { GET: {}, POST: {}, REST: {} }
    },

    {
      key: "/rest/ddd?pi=1&pz=2",
      match: {
        pathname: '/rest/ddd',
        tpl: '/rest/ddd.mock',
        statusCode: 200,
        delay: 0,
        GET: { pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
    {
      key: "/rest/ddd/list?pi=1&pz=2",
      match: {
        pathname: '/rest/ddd/list',
        tpl: '/rest/ddd/list.mock',
        statusCode: 200,
        delay: 0,
        GET: { pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
    {
      key: "/rest/ddd/detail?id=1",
      match: {
        pathname: '/rest/ddd/detail',
        tpl: '/rest/ddd/detail.mock',
        statusCode: 200,
        delay: 0,
        GET: { id: '1' },
        POST: {},
        REST: {}
      }
    },

    {
      key: "/rest?method=ddd&pi=1&pz=2",
      match: {
        pathname: '/rest',
        tpl: '/rest/method.ddd.mock',
        apiKey: 'method=ddd',
        statusCode: 200,
        delay: 0,
        GET: { method: 'ddd', pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
    {
      key: "/rest/ddd?method=list&pi=1&pz=2",
      match: {
        pathname: '/rest/ddd',
        tpl: '/rest/ddd/method.list.mock',
        apiKey: 'method=list',
        statusCode: 200,
        delay: 0,
        GET: { method: 'list', pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
    {
      key: "/rest/ddd?method=detail&pi=1&pz=2",
      match: {
        pathname: '/rest/ddd',
        tpl: '/rest/ddd/method.detail.mock',
        apiKey: 'method=detail',
        statusCode: 200,
        delay: 0,
        GET: { method: 'detail', pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },



    {
      key: "/rest/dddd/1-2",
      match: {
        pathname: '/rest/{method}/{pi}-{pz}',
        tpl: '/rest/{method}/{pi}-{pz}.mock',
        statusCode: 200,
        delay: 0,
        GET: {},
        POST: {},
        REST: { method: 'dddd', pi: '1', pz: '2' }
      }
    },
    {
      key: "/rest/dddd/list/1-2",
      match: { GET: {}, POST: {}, REST: {} }
    },
    {
      key: "/rest/dddd/detail/1",
      match: { GET: {}, POST: {}, REST: {} }
    },

    {
      key: "/rest/dddd?pi=1&pz=2",
      match: { GET: { pi: '1', pz: '2' }, POST: {}, REST: {} }
    },
    {
      key: "/rest/dddd/list?pi=1&pz=2",
      match: { GET: { pi: '1', pz: '2' }, POST: {}, REST: {} }
    },
    {
      key: "/rest/dddd/detail?id=1",
      match: { GET: { id: '1' }, POST: {}, REST: {} }
    },

    {
      key: "/rest?method=dddd&pi=1&pz=2",
      match: { GET: { method: 'dddd', pi: '1', pz: '2' }, POST: {}, REST: {} }
    },
    {
      key: "/rest/dddd?method=list&pi=1&pz=2",
      match: { GET: { method: 'list', pi: '1', pz: '2' }, POST: {}, REST: {} }
    },
    {
      key: "/rest/dddd?method=detail&pi=1&pz=2",
      match: {
        GET: { method: 'detail', pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },



    {
      key: "/rest/111/1-2",
      match: {
        pathname: '/rest/111/{pi}-{pz}',
        tpl: '/rest/111/{pi}-{pz}.mock',
        statusCode: 200,
        delay: 0,
        GET: {},
        POST: {},
        REST: { method: '111', pi: '1', pz: '2' }
      }
    },
    {
      key: "/rest/111/list/1-2",
      match: {
        pathname: '/rest/111/{method}/{pi}-{pz}',
        tpl: '/rest/111/{method}/{pi}-{pz}.list.mock',
        statusCode: 200,
        delay: 0,
        GET: {},
        POST: {},
        REST: { method: 'list', pi: '1', pz: '2' }
      }
    },
    {
      key: "/rest/111/detail/1",
      match: { GET: {}, POST: {}, REST: {} }
    },

    {
      key: "/rest/111?pi=1&pz=2",
      match: {
        pathname: '/rest/111',
        tpl: '/rest/111.mock',
        statusCode: 200,
        delay: 0,
        GET: { pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
    {
      key: "/rest/111/list?pi=1&pz=2",
      match: {
        pathname: '/rest/111/list',
        tpl: '/rest/111/list.mock',
        statusCode: 200,
        delay: 0,
        GET: { pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
    {
      key: "/rest/111/detail?id=1",
      match: {
        pathname: '/rest/111/detail',
        tpl: '/rest/111/detail.mock',
        statusCode: 200,
        delay: 0,
        GET: { id: '1' },
        POST: {},
        REST: {}
      }
    },

    {
      key: "/rest?method=111&pi=1&pz=2",
      match: {
        pathname: '/rest',
        tpl: '/rest/method.111.mock',
        apiKey: 'method=111',
        statusCode: 200,
        delay: 0,
        GET: { method: '111', pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
    {
      key: "/rest/111?method=list&pi=1&pz=2",
      match: {
        pathname: '/rest/111',
        tpl: '/rest/111/method.list.mock',
        apiKey: 'method=list',
        statusCode: 200,
        delay: 0,
        GET: { method: 'list', pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
    {
      key: "/rest/111?method=detail&pi=1&pz=2",
      match: {
        pathname: '/rest/111',
        tpl: '/rest/111/method.detail.mock',
        apiKey: 'method=detail',
        statusCode: 200,
        delay: 0,
        GET: { method: 'detail', pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },



    {
      key: "/rest/1111/1-2",
      match: {
        pathname: '/rest/{method}/{pi}-{pz}',
        tpl: '/rest/{method}/{pi}-{pz}.mock',
        statusCode: 200,
        delay: 0,
        GET: {},
        POST: {},
        REST: { method: '1111', pi: '1', pz: '2' }
      }
    },
    {
      key: "/rest/1111/list/1-2",
      match: { GET: {}, POST: {}, REST: {} }
    },
    {
      key: "/rest/1111/detail/1",
      match: { GET: {}, POST: {}, REST: {} }
    },

    {
      key: "/rest/1111?pi=1&pz=2",
      match: { GET: { pi: '1', pz: '2' }, POST: {}, REST: {} }
    },
    {
      key: "/rest/1111/list?pi=1&pz=2",
      match: { GET: { pi: '1', pz: '2' }, POST: {}, REST: {} }
    },
    {
      key: "/rest/1111/detail?id=1",
      match: { GET: { id: '1' }, POST: {}, REST: {} }
    },

    {
      key: "/rest?method=1111&pi=1&pz=2",
      match: { GET: { method: '1111', pi: '1', pz: '2' }, POST: {}, REST: {} }
    },
    {
      key: "/rest/1111?method=list&pi=1&pz=2",
      match: { GET: { method: 'list', pi: '1', pz: '2' }, POST: {}, REST: {} }
    },
    {
      key: "/rest/1111?method=detail&pi=1&pz=2",
      match: {
        GET: { method: 'detail', pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },



    {
      key: "/rest/测试/1-2",
      match: {
        pathname: '/rest/测试/{pi}-{pz}',
        tpl: '/rest/测试/{pi}-{pz}.mock',
        statusCode: 200,
        delay: 0,
        GET: {},
        POST: {},
        REST: { method: '测试', pi: '1', pz: '2' }
      }
    },
    {
      key: "/rest/测试/list/1-2",
      match: {
        pathname: '/rest/测试/{method}/{pi}-{pz}',
        tpl: '/rest/测试/{method}/{pi}-{pz}.list.mock',
        statusCode: 200,
        delay: 0,
        GET: {},
        POST: {},
        REST: { method: 'list', pi: '1', pz: '2' }
      }
    },
    {
      key: "/rest/测试/detail/1",
      match: { GET: {}, POST: {}, REST: {} }
    },

    {
      key: "/rest/测试?pi=1&pz=2",
      match: {
        pathname: '/rest/测试',
        tpl: '/rest/测试.mock',
        statusCode: 200,
        delay: 0,
        GET: { pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
    {
      key: "/rest/测试/list?pi=1&pz=2",
      match: {
        pathname: '/rest/测试/list',
        tpl: '/rest/测试/list.mock',
        statusCode: 200,
        delay: 0,
        GET: { pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
    {
      key: "/rest/测试/detail?id=1",
      match: {
        pathname: '/rest/测试/detail',
        tpl: '/rest/测试/detail.mock',
        statusCode: 200,
        delay: 0,
        GET: { id: '1' },
        POST: {},
        REST: {}
      }
    },

    {
      key: "/rest?method=测试&pi=1&pz=2",
      match: {
        pathname: '/rest',
        tpl: '/rest/method.测试.mock',
        apiKey: 'method=测试',
        statusCode: 200,
        delay: 0,
        GET: { method: '测试', pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
    {
      key: "/rest/测试?method=list&pi=1&pz=2",
      match: {
        pathname: '/rest/测试',
        tpl: '/rest/测试/method.list.mock',
        apiKey: 'method=list',
        statusCode: 200,
        delay: 0,
        GET: { method: 'list', pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
    {
      key: "/rest/测试?method=detail&pi=1&pz=2",
      match: {
        pathname: '/rest/测试',
        tpl: '/rest/测试/method.detail.mock',
        apiKey: 'method=detail',
        statusCode: 200,
        delay: 0,
        GET: { method: 'detail', pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },


    { // encodeURI('测试') = "%E6%B5%8B%E8%AF%95"
      key: "/rest/%E6%B5%8B%E8%AF%95/1-2",
      match: {
        pathname: '/rest/{method}/{pi}-{pz}',
        tpl: '/rest/{method}/{pi}-{pz}.mock',
        statusCode: 200,
        delay: 0,
        GET: {},
        POST: {},
        REST: { method: '%E6%B5%8B%E8%AF%95', pi: '1', pz: '2' }
      }
    },
    {
      key: "/rest/%E6%B5%8B%E8%AF%95/list/1-2",
      match: { GET: {}, POST: {}, REST: {} }
    },
    {
      key: "/rest/%E6%B5%8B%E8%AF%95/detail/1",
      match: { GET: {}, POST: {}, REST: {} }
    },

    {
      key: "/rest/%E6%B5%8B%E8%AF%95?pi=1&pz=2",
      match: { GET: { pi: '1', pz: '2' }, POST: {}, REST: {} }
    },
    {
      key: "/rest/%E6%B5%8B%E8%AF%95/list?pi=1&pz=2",
      match: { GET: { pi: '1', pz: '2' }, POST: {}, REST: {} }
    },
    {
      key: "/rest/%E6%B5%8B%E8%AF%95/detail?id=1",
      match: { GET: { id: '1' }, POST: {}, REST: {} }
    },

    {
      key: "/rest?method=%E6%B5%8B%E8%AF%95&pi=1&pz=2",
      match: {
        pathname: '/rest',
        tpl: '/rest/method.测试.mock',
        apiKey: 'method=测试',
        statusCode: 200,
        delay: 0,
        GET: { method: '测试', pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
    {
      key: "/rest/%E6%B5%8B%E8%AF%95?method=list&pi=1&pz=2",
      match: { GET: { method: 'list', pi: '1', pz: '2' }, POST: {}, REST: {} }
    },
    {
      key: "/rest/%E6%B5%8B%E8%AF%95?method=detail&pi=1&pz=2",
      match: {
        GET: { method: 'detail', pi: '1', pz: '2' },
        POST: {},
        REST: {}
      }
    },
  ];

  tests.forEach(function (test) {
    it('test req ' + test.key + ' : match : ' + (test.match.tpl || 'null'), function () {
      var matched = path2mock({ url: test.key, headers: { host: "api.example.com" } }, {}, mocks.mock);
      assert.equal(matched.tpl, test.match.tpl);
      assert.equal(matched.GET.method, test.match.GET.method);
      assert.equal(matched.GET.pi, test.match.GET.pi);
      assert.equal(matched.GET.pz, test.match.GET.pz);
      assert.equal(matched.GET.id, test.match.GET.id);
      assert.equal(matched.REST.method, test.match.REST.method);
      assert.equal(matched.REST.pi, test.match.REST.pi);
      assert.equal(matched.REST.pz, test.match.REST.pz);
      assert.equal(matched.REST.id, test.match.REST.id);
    });
  });
});
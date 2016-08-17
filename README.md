# http-mock-json-server

## 概述 Overview
***json数据接口模拟服务***

##
>使用node搭建了一个模拟服务端api的服务，根据mockJSON的规则，生成随机数据。生成随机数据的核心是[Mockjs](http://mockjs.com)，但是其调用方式为在页面中引入mock.js的方式拦截Ajax，不太符合本人的需求，所以做了node server封装，同时加入proxy功能，可以只拦截部分配置的接口，未配置的接口可以根据配置转发给源服务器。具体mockJSON的规则可以参考[Mockjs](http://mockjs.com)中的文档。


### 安装环境 Requirements

* node 4.1.0+
* node-canvas 此模块安装比较复杂，需要先单独安装

### 安装/更新 Install/Update

`npm install -g http-mock-json-server`

### 命令 Commands

`http-mock`

#####运行目录：

`mock模板文件目录，mock.json所在目录。`

#####功能简介：

`根据mock.json文件中的配置，匹配请求路径和mock模板文件直接的关系。如果不配置此文件，则安装请求路径加 .mock 后缀的方式查找mock模板文件。`

#####mock.json：

```json
{
  "host": "http://api.example.com/",
  "ip":"",
  "port":"",
  "mock":[{
    "pathname":"/test",
    "tpl":"test.mock"
  },{
    "pathname":"/test/deep/path",
    "tpl":"test2.mock"
  }]
}
```

##### 参数说明：
```
host：需要代理的域名
ip：需要代理的域名的ip
port：需要代理的域名的端口
mock：请求路径和模板的匹配关系。
  pathname：请求路径
  tpl：mockJSON模板文件
```

##### test.mock

```
{
  "string|1-10": "★",
  "string|3": "★★★",
  "number1|+1": 202,
  "number2|1-100": 100,
  "number3|1-100.1-10": 1,
  "number4|123.1-10": 1,
  "number5|123.10": 1.123
}
```

##### host

`127.0.0.1 api.example.com`

##### nginx conf 配置

```
server {
    listen 80;
    server_name api.example.com;
    charset utf-8;
    autoindex       on;
    autoindex_exact_size    on;
    index index.html;

    location ~ / {
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-NginX-Proxy true;
      proxy_set_header x-request-filename $request_filename;
      proxy_set_header Host             $host;
      proxy_pass http://127.0.0.1:7071;
      proxy_redirect off;
    }
}
```
# http-mock-json-server

## 概述 Overview
***json数据接口模拟服务***

##
>使用node搭建了一个模拟服务端api的服务，根据mockJSON的规则，生成随机数据，同时可以通过修改配置文件`mock.json`动态配置返回数据，请求状态（502，404等），以及请求延时。。生成随机数据的核心是[Mockjs](http://mockjs.com)，但是其调用方式为在页面中引入mock.js的方式拦截Ajax，不太符合本人的需求，所以做了node server封装，同时加入proxy功能，可以只拦截部分配置的接口，未配置的接口可以根据配置转发给源服务器。具体mockJSON的规则可以参考[Mockjs](http://mockjs.com)中的文档。


### 安装环境 Requirements
* node 4.1.0+

### 安装 node-canvas

**注意** node-canvas 为可选依赖，安装过程中如果此模块报错不影响使用。如果不安装 node-canvas 则 `@dataImage` 不可用。

#### Mac
1. 安装 brew
2. brew install pkg-config cairo libpng jpeg giflib

#### Windows
1. 安装 Microsoft Visual C++ 2010 or later 下载安装免费的 Visual Studio [Community](https://go.microsoft.com/fwlink/?LinkId=532606&clcid=0x409) 或 [Express](https://go.microsoft.com/fwlink/?LinkId=615464&clcid=0x409) 即可。`安装的时候注意勾选 C++ 支持`
2. 安装 [Python 2.7.x for Windows](http://www.python.org/getit)
3. 安装 `npm install -g node-gyp`
4. 下载 GTK 2 [Win32](http://ftp.gnome.org/pub/GNOME/binaries/win32/gtk+/2.24/gtk+-bundle_2.24.10-20120208_win32.zip) 或 [Win64](http://ftp.gnome.org/pub/GNOME/binaries/win64/gtk+/2.22/gtk+-bundle_2.22.1-20101229_win64.zip)，解压到 c:/GTK
5. 安装 [libjpeg-turbo SDK for Visual C++](http://sourceforge.net/projects/libjpeg-turbo/) 默认安装

> 参考 https://github.com/Automattic/node-canvas/wiki/Installation---Windows

### 安装/更新 Install/Update

`npm install -g http-mock-json-server`

### 命令 Commands

`http-mock`

#### -p --prot 设置模拟数据服务的监听端口
>注意修改nginx的对应proxy的端口

`http-mock --prot=7072`

#### -c --config 设置mock配置文件

`http-mock -c "mock.proxy.json"`
`http-mock --config="mock.proxy.json"`

#### --log 显示GET、POST请求参数

`http-mock --log`

##### 运行目录：

`mock模板文件目录，mock.json所在目录。`

##### 功能简介：

`根据mock.json文件中的配置，匹配请求路径和mock模板文件直接的关系。如果不配置此文件，则安装请求路径加 .mock 后缀的方式查找mock模板文件。`

##### mock.json：

```json
{
  "host": "http://api.example.com/",
  "ip":"",
  "port":"",
  "mock":[{
    "pathname":"/test",
    "tpl":"test.mock",
    "statusCode": 200,
    "delay": 5000
  }, {
    "pathname":"/test/deep/path",
    "tpl":"test2.mock"
  }, {
    "pathname":"/rest/path/{arg1}/{arg2}-{arg3}",
    "tpl":"rest.mock"
  }, {
    "pathname":"/rest/{method}/{arg1}/{arg2}-{arg3}",
    "apiKey":"method=list",
    "tpl":"rest.list.mock"
  }, {
    "pathname":"/rest",
    "apiKey":"method=list",
    "tpl":"rest.method.list.mock",
    "contentType": "application/json;charset=utf-8"
  }]
}
```

##### 支持REST风格

使用`{参数名}`的方式如：/rest/{method}/{arg1}/{arg2}-{arg3}

##### 支持使用请求参数（GET、POST、REST）区分不同的接口

`"apiKey":"参数名=参数值"`如："apiKey":"method=list"

##### 参数说明：
```
host：需要代理的域名，非必填
ip：需要代理的域名的ip，非必填，如果不填，相当于放弃proxy到源服务器。
port：需要代理的域名的端口，非必填
mock：请求路径和模板的匹配关系。
  pathname：请求路径
  apiKey: 请求参数（或rest中的参数）作为 key ，区分接口。使用等号分隔：参数名=参数值
  tpl：mockJSON模板文件
  statusCode：http请求返回码，默认如果模板正常则是200。
  delay：http请求延时
  contentType: content-type, 如果没有配置此项，优先使用 pathname 后缀对应的content-type，如果 pathname 没有后缀，或找不到后缀对应的 content-type，则默认为'application/json;charset=utf-8'
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

##### 在mockjs的基础上扩展对GET、POST请求参数，以及REST风格参数的支持
>1、不支持多媒体类型上传数据；2、使用方括号包含参数名，如：@GET['id']；3、如果为key，必须使用双引号将请括起来如："get": "@GET['id']"

```
{
  "get": "@GET['id']",
  "post|3": "@POST['user']",
  "number1|+@GET['idstep']": 202,
  "number2|1-100": "@REST['number2']",
  "number3|1-100.1-10": 1,
  "number4|123.1-10": 1,
  "number5|123.10": 1.123
}
```

mock文件示例1：pageIndex、pageSize分页

```
{
  "errorCode":0,
  "message":"success",
  "data|@GET['pageSize']":[{
    "pageIndex":"@GET['pageIndex']",
    "pageSize":"@GET['pageSize']",
    "index|+1":1,
    "id": function(){
      return (this.pageIndex - 1) * this.pageSize + this.index;
    },
    "content":"@cparagraph(2)"
  }],
  "total": 83,
  "pageIndex":"@GET['pageIndex']",
  "pageSize":"@GET['pageSize']",
  "totalPageCount": function(){
    return Math.ceil(this.total / this.pageSize);
  },
  "more": function(){
    return this.totalPageCount - this.pageIndex > 0;
  }
}
```
?pageIndex=2&pageSize=3 输出

```json
{
  errorCode: 0,
  message: "success",
  data: [
    {
      pageIndex: "2",
      pageSize: "3",
      index: 1,
      content: "始属拉型文们表区外最必比将气或所。办联毛受料但平党马市想群片统技必问。",
      id: 4
    },
    {
      pageIndex: "2",
      pageSize: "3",
      index: 2,
      content: "年采质性带必安技反书化度或者省专集结。每厂响无局空养更机那精其节。",
      id: 5
    },
    {
      pageIndex: "2",
      pageSize: "3",
      index: 3,
      content: "三决通商志验空从五质给手己。但间温向准你青交保果决器区已候老酸须。",
      id: 6
    }
  ],
  total: 83,
  pageIndex: "2",
  pageSize: "3",
  totalPageCount: 28,
  more: true
}
```


mock文件示例2：start、length分页

```
{
  "errorCode":0,
  "message":"success",
  "data|@GET['length']":[{
    "start":"@GET['start']",
    "length":"@GET['length']",
    "index|+1":1,
    "id": function(){
      return +this.start - 1 + this.index;
    },
    "content":"@cparagraph(2)"
  }],
  "total": 83,
  "start":"@GET['start']",
  "length":"@GET['length']",
  "more": function(){
    return this.total - this.start - this.length > 0;
  }
}
```

/test?start=70&length=5 输出

```json
{
  errorCode: 0,
  message: "success",
  data: [
    {
      start: "71",
      length: "3",
      index: 1,
      content: "任须住形些速社主新变经属国公话做细。指马达省步国信所子体安路已走格。",
      id: 71
    },
    {
      start: "71",
      length: "3",
      index: 2,
      content: "二即适权世花同想真近月计观精条等。全别毛叫统属维两过完观天些为验队除。",
      id: 72
    },
    {
      start: "71",
      length: "3",
      index: 3,
      content: "路必些型眼然其工社维克通当意。取斯走全维市作断内极之干因车政。",
      id: 73
    }
  ],
  total: 83,
  start: "71",
  length: "3",
  more: true
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
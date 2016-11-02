# http-mock-json-server

## 概述 Overview
***json数据接口模拟服务***

##
>使用node搭建了一个模拟服务端api的服务，根据mockJSON的规则，生成随机数据，同时可以通过修改配置文件`mock.json`动态配置返回数据，请求状态（502，404等），以及请求延时。。生成随机数据的核心是[Mockjs](http://mockjs.com)，但是其调用方式为在页面中引入mock.js的方式拦截Ajax，不太符合本人的需求，所以做了node server封装，同时加入proxy功能，可以只拦截部分配置的接口，未配置的接口可以根据配置转发给源服务器。具体mockJSON的规则可以参考[Mockjs](http://mockjs.com)中的文档。


### 安装环境 Requirements
* node 4.1.0+

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
  },{
    "pathname":"/test/deep/path",
    "tpl":"test2.mock"
  }]
}
```

##### 参数说明：
```
host：需要代理的域名，非必填
ip：需要代理的域名的ip，非必填，如果不填，相当于放弃proxy到源服务器。
port：需要代理的域名的端口，非必填
mock：请求路径和模板的匹配关系。
  pathname：请求路径
  tpl：mockJSON模板文件
  statusCode：http请求返回码，默认如果模板正常则是200。
  delay：http请求延时
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

##### 在mockjs的基础上扩展对GET、POST请求参数的支持
>1、不支持多媒体类型上传数据；2、使用方括号包含参数名，如：GET['id']；3、如果为key，必须使用双引号将请括起来如："get": "GET['id']"

```
{
  "get": "GET['id']",
  "post|3": "POST['user']",
  "number1|+GET['idstep']": 202,
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
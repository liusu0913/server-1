# 医药业务线Node.js服务端开发种子项目

- 一个基于KOA2的开发的node.js服务端开发框架

开发者文档：[点击前往](https://eyao.qq.com/node-docs/)

## 注意事项

- 该工程原则上不允许进行任何修改，如果一定要对种子工程改动，要通知`erikqin`、`maxxqliao`或`fesuliu`，否则出现任何项目问题，自行解决

## 如何使用

### 安装脚手架

- 确保有安装tnpm，如果没有安装，[点击前往安装](http://tnpm.oa.com/)

``` bash
tnpm install @tencent/r-cli -g
```

### 创建项目

``` bash
rocket create test
? 请选择要创建的项目类型 koa-seed
代码拉取中…
Cloning into 'tmp'...
正在创建"test"项目…
删除.git配置信息
清除临时目录
Initialized empty Git repository in /Users/erikqin/tencent/test/test/.git/
test项目创建完成!
? 请选择要安装的方式? npm  // 推荐yarn 或 npm，tnpm安装会有报错
```

### 创建CRUD（暂未支持）

- 一键创建CRUD

``` bash
// 创建user模块的CRUD
rocket createKoa user

```

### 开发模式

``` bash
npm run dev
```

### 正式环境运行

``` bash
npm run start
```

### CI、CD

- CI推荐使用CODING CI，[点击前往](http://tencent.coding.oa.com)
- CD推荐使用STKE，[点击前往](http://kubernetes.oa.com/tke2)

### 目录规范

```
.
├── bin
├── config
│   ├── development
│   ├── production
├── controllers
│   ├── basic
│   │   ├── wxapp
│   │   │   └── user
│   ├── admin
│   ├── doctor
│   ├── patient
│   ├── test
│   ├── third
├── libs
│   ├── cos
│   ├── db
│   ├── redis
│   ├── request
│   ├── sms
│   ├── third
│   └── weixin
├── log
├── middleware
│   └── router
├── models
├── public
│   └── style
├── service
│   ├── qcloud
│   │   └── cos
│   ├── sms
│   ├── weixin
│   └── wxopen
├── task
├── util
│   ├── args
│   ├── date
│   ├── decode
│   ├── format
│   └── logger
└── views
```

#### 路由规范
命名格式为：/端/模块/页/行为

e.g. /basic/wxapp/user/login => /基础能力/微信小程序/用户/登陆

| 文件夹 | 功能介绍 | 框架主页 |
| ------------ | ------------ | ------------ |
| bin | 启动文件夹  | [点击前往](https://eyao.qq.com/node-docs/) |
| config | 相关配置，以环境作区分  | [点击前往](https://eyao.qq.com/uniapp-docs/) |
| controllers | 相关路由，以`端`为第一级子文件夹，`模块`为第二级子文件夹，`页`为文件，`行为`为函数单位 | [点击前往](https://eyao.qq.com/cli-docs/) |
| libs | 底层能力封装 | [点击前往](https://eyao.qq.com/node-docs/) |
| openapi | 开放平台API封装，如：公众号、小程序、微信开放平台等 | [点击前往](https://eyao.qq.com/node-docs/) |
| log | 日志记录 | [点击前往](https://eyao.qq.com/node-docs/) |
| middleware | 中间件，命名规则为：中间件文件夹/index.js | [点击前往](https://eyao.qq.com/node-docs/) |
| models | 数据库对象描述，使用npm run auto自动生成，禁止手动修改 | [点击前往](https://eyao.qq.com/node-docs/) |
| public | 静态资源 | [点击前往](https://eyao.qq.com/node-docs/) |
| service | 业务代码，路由均应该通过service完成业务逻辑，在service内调用models完成数据库操作，调用libs完成底层能力 | [点击前往](https://eyao.qq.com/node-docs/) |
| task | 定时任务 | [点击前往](https://eyao.qq.com/node-docs/) |
| util | 工具类，包括日期时间、解码、输出格式化等 | [点击前往](https://eyao.qq.com/node-docs/) |
| views | 页面模板 | [点击前往](https://eyao.qq.com/node-docs/) |

## 数据库设计规范

### 表命名规则

数据库表命名按端+功能表进行命名

| 端 | 功能表 | 表名 |
| ------------ | ------------ | ------------ |
| 管理系统 | user  | admin_user |
| 医生端 | user  | doctor_user |
| 患者端 | user  | patient_user |
| 公共端、多端使用 | user  | user |
| 三方平台 | user  | third_user |

### 字段命名规则

| 字段含义 | 字段名 | 描述 |
| ------------ | ------------ | ------------ |
| 主键ID | id  | 建议md5(uuid) |
| 姓名 | name  | 用于各类名称，如商品名称 |
| 标题 | title  | 用于各类标题，如文章标题 |
| 删除标识 | disabled  | 字符串类型，0、正常，1、删除 |

### 外键设计规则

`ps:数据库设计时，所有的表关联要在sql语句中体现出来，sequelize会创建带关系的models`

- 命名规则是关联表+_id [`user.role_id = role.id`]

| 主表 | 关联表 | 字段名 | 描述 |
| ------------ | ------------ | ------------ | ------------ |
| user | role  | role_id | user表里面的role_id是外键关联的role表中的id |

### 别名映射兼容代码提示

使用`best-require`进行别名映射时，会影响代码提示和`转到文件`功能，使开发和调试变得非常不方便，解决该兼容性问题需要完成5步：

#### 1.安装best-require
```
npm i best-require --save
```

#### 2.进行别名映射
```
require('best-require')(process.cwd())
```

3.创建并设置jsconfig.json
```
{
    "compilerOptions": {
        "allowSyntheticDefaultImports": true,
        "baseUrl": "./",
        "paths": {
            "~/*":["*"]
        }
    },
    "exclude": [
        "node_modules",
    ]
}

```

#### 4.在`vscode`中安装`path-intellisense`并在设置中配置`setting.json`
```
"path-intellisense.mappings": {
    "~":"${workspaceRoot}"
}
```

#### 5.重启`vscode`完成兼容

### 最佳关联实践（待完善）

// TODO

## TODO LIST

- [ ] 支持一键生成种子项目
- [x] 路由自动化注册
- [x] 多环境配置
- [ ] 集成常用中间件、日志
- [ ] 集成proxy转发
- [ ] 集成微信公众号、小程序常用服务，持续更新
- [ ] 内置通用filter、自定义指定
- [ ] 支持微信扫码登录、自定义帐号密码登录
- [ ] 集成权限管理
- [ ] 集成数据上报、错误上报，aegis.oa.com
- [ ] 集成安全能力、XSS、CSRF、钓鱼攻击、HTTP参数污染、远程代码执行等
- [ ] 支持国际化
- [x] 集成Sequelize、redis、mongo暂不支持，通过配置使用

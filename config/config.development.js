process.env.DEBUG = process.env.DEBUG || 'koa-grace-error:*'

module.exports = {
  site: {
    env: 'production',
    port: 3000,
    hostname: 'localhost'
  },
  mysql: {
    host: '119.28.163.231',
    port: 6000,
    username: 'root',
    password: 'Zym123,.',
    database: 'maikaiying',
    dialect: 'mysql',
    logging: false
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: ''
  },
  third: {
    component_appid: 'XXXX',
    component_appsecret: 'XXXX'
  },
  mp: {
    appid: 'wxa740aa4cf482d798',
    secret: '78442db1117beb95b0d8166f7a7bceca'
  },
  serviceAccount: {
    appid: 'wxc26091fcd766a086',
    secret: '442a644e3d3497dc6224eeb5d6dfa536'
  },
  jwt: {
    secret: 'XXXX',
    expiresIn: 60 * 60 * 24 * 7
  },
  captcha: {
    appId: 'XXXX',
    appSecretKey: 'XXXX'
  },
  qcloud: {
    secretId: 'AKID3vYv1qPjmZ6ML4WhbEbiY7PRCgtue8LH',
    secretKey: 'h7G9m8D1astd6KHeka9RREm32kCNHuHN'
  },
  cos: {
    proxy: '',
    durationSeconds: 1800,
    bucket: 'xxx-xxx',
    region: 'ap-xxx',
    allowPrefix: '*',
    // 密钥的权限列表
    allowActions: [
      // 所有 action 请看文档 https://cloud.tencent.com/document/product/436/31923
      // 简单上传
      'name/cos:PutObject',
      'name/cos:PostObject',
      'name/cos:AppendObject',
      'name/cos:GetObject',
      'name/cos:HeadObject',
      'name/cos:OptionsObject',
      'name/cos:PutObjectCopy',
      'name/cos:PostObjectRestore',
      // 分片上传
      'name/cos:InitiateMultipartUpload',
      'name/cos:ListMultipartUploads',
      'name/cos:ListParts',
      'name/cos:UploadPart',
      'name/cos:CompleteMultipartUpload',
      'name/cos:AbortMultipartUpload'
    ]
  },
  sms: {
    signMethod: 'HmacSHA256', // SDK 默认用 TC3-HMAC-SHA256 进行签名，非必要请不要修改该字段
    reqMethod: 'POST', // SDK 默认使用 POST 方法
    reqTimeout: 30, // SDK 有默认的超时时间，非必要请不要进行调整
    endpoint: 'sms.tencentcloudapi.com',
    region: 'ap-shanghai', // 地域信息，根据所在地选择适用的
    smsType: 0, // 短信类型：0表示普通短信, 1表示营销短信
    international: 0, // 是否国际/港澳台短信：0：表示国内短信；1：表示国际/港澳台短信
    smsSdkAppid: '1400624155', // 短信应用ID：在 [短信控制台] 添加应用后生成的实际 SDKAppID，例如1400006666
    sign: '麦凯盈', // 短信签名内容，必须填写已审核通过的签名
    templateId: '1278875' // 短信模板ID
  },
  codeEx: 60 * 5,
  pstn: {
    cache_key: 'pstn:%s:%s',
    appid: 'XXX',
    id: 'XXX',
    cityId: 'XXX',
    maxAssignTime: 'XXX', // 绑定时长单位s
    domain: 'XXX',
    api: {
      getVirtualNumber: 'XXX',
      delVirtualNumber: 'XXX'
    },
    hangupUrl: 'XXX',
    recordUrl: 'XXX'
  }
}

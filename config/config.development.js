process.env.DEBUG = process.env.DEBUG || 'koa-grace-error:*'

module.exports = {
  site: {
    env: 'development',
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
    host: '119.28.163.231',
    port: 6379
  },
  third: {
    component_appid: 'XXXX',
    component_appsecret: 'XXXX'
  },
  mp: {
    appid: 'XXXX',
    secret: 'XXXX'
  },
  serviceAccount: {
    appid: 'XXXX',
    secret: 'XXXX'
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
    secretId: 'xxxx',
    secretKey: 'xxxx'
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
    region: 'ap-beijing', // 地域信息，根据所在地选择适用的
    smsType: 0, // 短信类型：0表示普通短信, 1表示营销短信
    international: 0, // 是否国际/港澳台短信：0：表示国内短信；1：表示国际/港澳台短信
    smsSdkAppid: 'xxxx', // 短信应用ID：在 [短信控制台] 添加应用后生成的实际 SDKAppID，例如1400006666
    sign: '腾讯科技', // 短信签名内容，必须填写已审核通过的签名
    templateId: '123456' // 短信模板ID
  }
}

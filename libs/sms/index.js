const tencentcloud = require('tencentcloud-sdk-nodejs')
const { secretId, secretKey } = global.config.qcloud
const {
  signMethod,
  reqMethod,
  reqTimeout,
  endpoint,
  region,
  smsType,
  international,
  smsSdkAppid,
  sign,
  templateId
} = global.config.sms

// 导入 SMS 模块的 client models
const SmsClient = tencentcloud.sms.v20190711.Client
const Models = tencentcloud.sms.v20190711.Models

const Credential = tencentcloud.common.Credential
const ClientProfile = tencentcloud.common.ClientProfile
const HttpProfile = tencentcloud.common.HttpProfile

/* 必要步骤：
 * 实例化一个认证对象，入参需要传入腾讯云账户密钥对 secretId 和 secretKey */
const cred = new Credential(secretId, secretKey)
/* 非必要步骤:
 * 实例化一个客户端配置对象，可以指定超时时间等配置 */
const httpProfile = new HttpProfile()
/* SDK 默认使用 POST 方法
 * 如需使用 GET 方法，可以在此处设置，但 GET 方法无法处理较大的请求 */
httpProfile.reqMethod = reqMethod
httpProfile.reqTimeout = reqTimeout
httpProfile.endpoint = endpoint

// 实例化一个 client 选项，可选，无特殊需求时可以跳过
const clientProfile = new ClientProfile()
clientProfile.signMethod = signMethod
clientProfile.httpProfile = httpProfile

/* 实例化 SMS 的 client 对象
 * SDK 会自动指定域名，通常无需指定域名，但访问金融区的服务时必须手动指定域名
 * 例如 SMS 的上海金融区域名为 sms.ap-shanghai-fsi.tencentcloudapi.com */
const client = new SmsClient(cred, region, clientProfile)

// 添加短信模板
exports.addSmsTemplate = async (templateName, templateContent, remark) => {
  const req = new Models.AddSmsTemplateRequest()
  req.TemplateName = templateName
  req.TemplateContent = templateContent
  req.SmsType = smsType
  req.International = international
  req.Remark = remark

  return new Promise((resolve, reject) => {
    client.AddSmsTemplate(req, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

// 删除短信模板
exports.deleteSmsTemplate = async templateId => {
  const req = new Models.DeleteSmsTemplateRequest()
  req.TemplateId = templateId

  return new Promise((resolve, reject) => {
    client.DeleteSmsTemplate(req, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

// 修改短信模板
exports.modifySmsTemplate = async (templateId, templateName, templateContent, remark) => {
  const req = new Models.ModifySmsTemplateRequest()
  req.TemplateId = templateId
  req.TemplateName = templateName
  req.TemplateContent = templateContent
  req.SmsType = smsType
  req.International = international
  req.Remark = remark

  return new Promise((resolve, reject) => {
    client.ModifySmsTemplate(req, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

// 短信模板状态查询
exports.describeSmsTemplateList = async templateIdSet => {
  const req = new Models.DescribeSmsTemplateListRequest()
  req.TemplateIdSet = templateIdSet

  return new Promise((resolve, reject) => {
    client.DescribeSmsTemplateList(req, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

// 发送短信
exports.sendSms = async (phoneNumberSet, templateParamSet = [], sessionContext = '') => {
  const req = new Models.SendSmsRequest()
  req.SmsSdkAppid = smsSdkAppid
  req.Sign = sign
  req.SessionContext = sessionContext
  req.PhoneNumberSet = phoneNumberSet
  req.TemplateID = templateId
  req.TemplateParamSet = templateParamSet

  return new Promise((resolve, reject) => {
    client.SendSms(req, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

// 拉取短信下发状态
exports.pullSmsSendStatus = async limit => {
  const req = new Models.PullSmsSendStatusRequest()
  req.SmsSdkAppid = smsSdkAppid
  req.Limit = limit

  return new Promise((resolve, reject) => {
    client.PullSmsSendStatus(req, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

// 拉取短信回复状态
exports.pullSmsReplyStatus = async limit => {
  const req = new Models.PullSmsReplyStatusRequest()
  req.SmsSdkAppid = smsSdkAppid
  req.Limit = limit

  return new Promise((resolve, reject) => {
    client.PullSmsReplyStatus(req, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

// 拉取单个号码短信下发状态 时间格式：UNIX 时间戳（秒），最大可拉取7天前的数据
exports.pullSmsSendStatusByPhoneNumber = async (phoneNumber, sendDateTime, endDateTime, limit) => {
  const req = new Models.PullSmsSendStatusByPhoneNumberRequest()
  req.SendDateTime = sendDateTime / 1000
  req.Offset = 0 // 目前固定为0
  req.Limit = limit
  req.PhoneNumber = phoneNumber
  req.SmsSdkAppid = smsSdkAppid
  if (endDateTime) {
    req.EndDateTime = endDateTime / 1000
  }

  return new Promise((resolve, reject) => {
    client.PullSmsSendStatusByPhoneNumber(req, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

// 拉取单个号码短信回复状态 时间格式：UNIX 时间戳，最大可拉取7天前的数据
exports.pullSmsReplyStatusByPhoneNumber = async (sendDateTime, limit, phoneNumber, endDateTime) => {
  const req = new Models.PullSmsReplyStatusByPhoneNumberRequest()
  req.SendDateTime = sendDateTime
  req.Offset = 0 // 目前固定为0
  req.Limit = limit
  req.PhoneNumber = phoneNumber
  req.SmsSdkAppid = smsSdkAppid
  req.EndDateTime = endDateTime

  return new Promise((resolve, reject) => {
    client.PullSmsReplyStatusByPhoneNumber(req, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

// 回执数据统计 时间格式：【yyyymmddhh】精确到小时
exports.callbackStatusStatistics = async (startDateTime, endDateTime, limit) => {
  const req = new Models.CallbackStatusStatisticsRequest()
  req.StartDateTime = startDateTime
  req.EndDateTime = endDateTime
  req.SmsSdkAppid = smsSdkAppid
  req.Limit = limit
  req.Offset = 0 // 目前固定为0

  return new Promise((resolve, reject) => {
    client.callbackStatusStatistics(req, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

// 发送短信数据统计 时间格式：【yyyymmddhh】精确到小时
exports.sendStatusStatistics = async (startDateTime, endDateTime, limit) => {
  const req = new Models.SendStatusStatisticsRequest()
  req.StartDateTime = startDateTime
  req.EndDateTime = endDateTime
  req.SmsSdkAppid = smsSdkAppid
  req.Limit = limit
  req.Offset = 0 // 目前固定为0

  return new Promise((resolve, reject) => {
    client.sendStatusStatistics(req, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

// 套餐包信息统计
exports.smsPackagesStatistics = async limit => {
  const req = new Models.SmsPackageStatisticsRequest()
  req.SmsSdkAppid = smsSdkAppid
  req.Limit = limit
  req.Offset = 0 // 目前固定为0

  return new Promise((resolve, reject) => {
    client.SmsPackagesStatistics(req, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

// 添加短信签名
exports.addSmsSign = async => {
  console.log('not implemented')
}

// 删除短信签名
exports.deleteSmsSign = async => {
  console.log('not implemented')
}

// 修改短信签名
exports.modifySmsSign = async => {
  console.log('not implemented')
}

// 短信签名状态查询
exports.describeSmsSignList = async => {
  console.log('not implemented')
}

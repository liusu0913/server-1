/* eslint-disable promise/param-names */
const STS = require('qcloud-cos-sts')
const config = global.config.cos
const { secretId, secretKey } = global.config.qcloud

const shortBucketName = config.bucket.substr(0, config.bucket.lastIndexOf('-'))
const appId = config.bucket.substr(1 + config.bucket.lastIndexOf('-'))

const policy = {
  version: '2.0',
  statement: [{
    action: config.allowActions,
    effect: 'allow',
    principal: { qcs: ['*'] },
    resource: [
      'qcs::cos:' + config.region + ':uid/' + appId + ':prefix//' + appId + '/' + shortBucketName + '/' + config.allowPrefix
    ]
  }]
}

const getCredential = async (ctx) => {
  return new Promise((reslove, reject) => {
    STS.getCredential({
      secretId: secretId,
      secretKey: secretKey,
      proxy: config.proxy,
      durationSeconds: config.durationSeconds,
      policy: policy
    }, function (err, tempKeys) {
      // console.log(err, tempKeys)
      if (err) {
        reject(err)
      } else {
        reslove(tempKeys)
      }
    })
  })
}

const generateTicket = async () => {
  // TODO 这里根据自己业务需要做好放行判断
  if (config.allowPrefix === '_ALLOW_DIR_/*') {
    return {
      Code: 'please update allowPrefix config',
      Message: '请修改 allowPrefix 配置项，指定允许上传的路径前缀'
    }
  } else {
    try {
      return await getCredential()
    } catch (ex) {
      return ex
    }
  }
}

module.exports = {
  generateTicket
}

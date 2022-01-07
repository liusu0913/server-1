/* eslint-disable handle-callback-err */
/* eslint-disable promise/param-names */
const util = require('~/util')
const { user } = require('~/models')
const { SECRET, NO_REGISTER, LOGIN_PASSWORD_ERROR } = require('~/const')
const jwt = require('jsonwebtoken')
const STS = require('qcloud-cos-sts')
// 获取临时密匙

module.exports = {
  async login (body) {
    let resID, resP
    const resultID = await user.findOne({
      where: {
        jobId: body.account
      }
    })
    const resultP = await user.findOne({
      where: {
        jobId: body.account,
        phone: body.password
      }
    })
    if (resultID) {
      resID = util.format.sucHandler(resultID)
    } else {
      resID = util.format.errHandler('工号未注册!')
    }

    if (resultP) {
      resP = util.format.sucHandler(resultP)
    } else {
      resP = util.format.errHandler('密码填写错误!')
    }

    if (resID.code !== 0) {
      return {
        code: NO_REGISTER,
        message: '该工号未注册'
      }
    }
    if (resID.code === 0 && resP.code !== 0) {
      return {
        code: LOGIN_PASSWORD_ERROR,
        message: '密码错误'
      }
    }
    const { data } = resP
    const token = await jwt.sign({
      jobId: data.jobId,
      name: data.name,
      phone: data.phone,
      companyId: data.companyId,
      role: data.role,
      belongCompany: data.belongCompany
    }, SECRET, {
      expiresIn: '7d'
    })
    return {
      code: 0,
      data: {
        token: token
      },
      message: 'success'
    }
  },
  async getCosConfig ({ bucket, region, allowPrefix = 'avatar', durationSeconds = 1800 }) {
    // 配置参数
    var config = {
      secretId: 'AKIDqXy93f04rNcacPwCBtKUNyIM8dqmSr0s', // 固定密钥
      secretKey: 'e16uRgeLlvoQlpc8NL2RZQ0JK4XicFbg', // 固定密钥
      bucket,
      region
    }
    var AppId = config.bucket.substr(config.bucket.lastIndexOf('-') + 1)

    const policy = {
      version: '2.0',
      statement: [{
        action: [
          'name/cos:PutObject',
          'name/cos:PostObject',
          'name/cos:InitiateMultipartUpload',
          'name/cos:ListMultipartUploads',
          'name/cos:ListParts',
          'name/cos:UploadPart',
          'name/cos:CompleteMultipartUpload',
          'name/cos:uploadFiles'
        ],
        effect: 'allow',
        principal: { qcs: ['*'] },
        resource: [
          'qcs::cos:' + config.region + ':uid/' + AppId + ':' + config.bucket + '/*'
        ]
      }]
    }
    return new Promise((resolve) => {
      try {
        // const policy = STS.getPolicy(scope)
        STS.getCredential({
          secretId: config.secretId,
          secretKey: config.secretKey,
          proxy: config.proxy,
          policy: policy,
          // allowPrefix,
          durationSeconds
        }, function (err, res) {
          if (err) {
            resolve(util.format.errHandler(`${err.Code}:${err.Message}`))
          }
          resolve({
            code: 0,
            data: res,
            message: 'success'
          })
        })
      } catch (error) {
        return error
      }
    })
  }
}

/* eslint-disable promise/param-names */
const ajv = require('ajv')({ allErrors: true })
const localize_zh = require('ajv-i18n/localize/zh')
const { merge } = require('lodash')

module.exports = {
  /**
   * 接口校验方法
   * @param {*} model 验证schema模型
   * @param {*} action 要验证的方法
   * @param {*} data 验证的数据
   */
  check (model, action, data) {
    return new Promise((reslove, reject) => {
      const { schema } = model
      const config = model[action] || {}
      const setting = merge({}, schema, config)
      // console.log('setting', setting)
      const validate = ajv.compile(setting)
      const valid = validate(data)
      localize_zh(validate.errors)
      if (valid) {
        reslove('ok')
      } else {
        const error = {
          code: 1003,
          message: ajv.errorsText(validate.errors)
        }
        reject(error)
      }
    })
  }
}

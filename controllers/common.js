const schema = require('~/validators/common')
const service = require('~/service/common')
const util = require('~/util')

exports.login = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'login', data)
    ctx.body = await service.login(data)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.getCosConfig = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'getCosConfig', data)
    ctx.body = await service.getCosConfig(data)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

const service = require('~/service/mini/wxuser')
const schema = require('~/validators/mini/wxuser')
const util = require('~/util')

exports.list = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'list', data)
    ctx.body = await service.list(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.info = async (ctx) => {
  try {
    const data = ctx.request.body
    const { openId } = data
    await util.validator.check(schema, 'info', data)
    ctx.body = await service.info({ openId }, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}
exports.visitHistroy = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'visitHistroy', data)
    ctx.body = await service.visitHistroy(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

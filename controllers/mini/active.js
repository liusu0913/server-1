const service = require('~/service/mini/active')
const schema = require('~/validators/mini/active')
const util = require('~/util')

exports.data = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'data', data)
    ctx.body = await service.data(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

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
    const { activeId } = data
    await util.validator.check(schema, 'info', data)
    ctx.body = await service.info({ activeId }, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

const service = require('~/service/mini/fodder')
const schema = require('~/validators/mini/fodder')
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
    const { fodderId } = data
    await util.validator.check(schema, 'info', data)
    ctx.body = await service.info({ fodderId }, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

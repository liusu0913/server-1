const service = require('~/service/admin/activeRemind')
const schema = require('~/validators/admin/activeRemind')
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

exports.create = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'create', data)
    ctx.body = await service.create(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

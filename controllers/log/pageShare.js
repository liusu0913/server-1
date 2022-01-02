const service = require('~/service/log')
const schema = require('~/validators/admin/system/shareLog')
const util = require('~/util')

exports.create = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'create', data)
    ctx.body = await service.shareCreate(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

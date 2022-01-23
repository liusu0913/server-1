const service = require('~/service/admin/data')
const schema = require('~/validators/admin/data')
const util = require('~/util')

exports.getActiveData = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'activeData', data)
    ctx.body = await service.activeData(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.getActiveDetail = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'activeDetail', data)
    ctx.body = await service.activeDetail(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.getActiveXlsx = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'activeDetail', data)
    ctx.body = await service.exportXlsx(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

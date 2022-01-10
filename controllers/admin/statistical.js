const service = require('~/service/admin/statistical')
const schema = require('~/validators/admin/statistical')
const util = require('~/util')

exports.wxuser = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'wxuser', data)
    ctx.body = await service.wxuser(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.active = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'active', data)
    ctx.body = await service.active(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.activeDetails = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'activeDetails', data)
    ctx.body = await service.activeDetails(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.rank = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'rank', data)
    ctx.body = await service.rank(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

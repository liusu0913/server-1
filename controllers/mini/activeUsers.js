const util = require('~/util')
const service = require('~/service/mini/activeUsers')
const schema = require('~/validators/mini/activeUsers')

exports.recommend = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'recommend', data)
    ctx.body = await service.recommend(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.regular = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'recommend', data)
    ctx.body = await service.regular(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.share = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'recommend', data)
    ctx.body = await service.share(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.tags = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'tags', data)
    ctx.body = await service.tags(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

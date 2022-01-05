const service = require('~/service/wxuser')
const schema = require('~/validators/admin/wxuser')
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

exports.update = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'update', data)
    const { openId } = data
    delete data.openId
    ctx.body = await service.update(data, { openId }, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.delete = async (ctx) => {
  try {
    const data = ctx.request.body
    const { openId } = data
    await util.validator.check(schema, 'delete', data)
    ctx.body = await service.delete({ openId }, ctx)
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

exports.data = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'data', data)
    ctx.body = await service.data(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

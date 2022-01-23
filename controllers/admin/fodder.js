const service = require('~/service/admin/fodder')
const schema = require('~/validators/admin/fodder')
const util = require('~/util')

exports.batchDelete = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'batchDelete', data)
    ctx.body = await service.batchDelete(data, ctx)
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
    const { fodderId } = data
    delete data.fodderId
    ctx.body = await service.update(data, { fodderId }, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.delete = async (ctx) => {
  try {
    const data = ctx.request.body
    const { fodderId } = data
    await util.validator.check(schema, 'delete', data)
    ctx.body = await service.delete({ fodderId }, ctx)
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

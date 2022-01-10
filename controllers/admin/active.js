const service = require('~/service/admin/active')
const schema = require('~/validators/admin/active')
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
    const { activeId } = data
    delete data.activeId
    ctx.body = await service.update(data, { activeId }, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.delete = async (ctx) => {
  try {
    const data = ctx.request.body
    const { activeId } = data
    await util.validator.check(schema, 'delete', data)
    ctx.body = await service.delete({ activeId }, ctx)
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

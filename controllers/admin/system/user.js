const service = require('~/service/admin/user')
const schema = require('~/validators/admin/system/user')
const util = require('~/util')

exports.list = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'list', data)
    ctx.body = await service.list(data)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.create = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'create', data)
    ctx.body = await service.create(data)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.update = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'update', data)
    const { id } = data
    delete data.id
    ctx.body = await service.update(data, { id })
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.delete = async (ctx) => {
  try {
    const data = ctx.request.body
    const { id } = data
    await util.validator.check(schema, 'delete', data)
    ctx.body = await service.delete({ id })
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.info = async (ctx) => {
  try {
    const data = ctx.request.body
    const { id } = data
    await util.validator.check(schema, 'info', data)
    ctx.body = await service.info({ id })
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

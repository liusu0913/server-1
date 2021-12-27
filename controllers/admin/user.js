const service = require('~/service/user')
const schema = require('~/validators/admin/user')
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
    const { jobId } = data
    delete data.jobId
    ctx.body = await service.update(data, { jobId }, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.active = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'active', data)
    const { jobId } = data
    delete data.jobId
    ctx.body = await service.update({ status: data.status }, { jobId }, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.delete = async (ctx) => {
  try {
    const data = ctx.request.body
    const { jobId } = data
    await util.validator.check(schema, 'delete', data)
    ctx.body = await service.delete({
      where: {
        jobId
      }
    }, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.info = async (ctx) => {
  try {
    const data = ctx.request.body
    const { jobId } = data
    await util.validator.check(schema, 'info', data)
    ctx.body = await service.info({ jobId }, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.batchAdd = async (ctx) => {
  try {
    const data = ctx.request.body
    data.file = ctx.request.files.file
    if (data.type) {
      data.type = Number(data.type)
    }
    if (data.role) {
      data.role = Number(data.role)
    }
    await util.validator.check(schema, 'batchAdd', data)
    const filePath = await util.upload.saveFile(ctx)
    ctx.body = await service.batchAdd({ filePath, type: data.type, role: data.role, ctx })
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

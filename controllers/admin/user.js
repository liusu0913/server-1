const service = require('~/service/admin/user')
const schema = require('~/validators/admin/user')
const util = require('~/util')

exports.filialeTree = async (ctx) => {
  try {
    ctx.body = await service.filialeTree(ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.batchHandle = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'batchHandle', data)
    ctx.body = await service.batchHandle(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.allList = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'allList', data)
    ctx.body = await service.allList(data, ctx)
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
    let jobId
    if (data.jobId) {
      jobId = data.jobId
    } else {
      jobId = ctx.session_user.jobId
    }
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

const service = require('~/service/admin/user')
const schema = require('~/validators/admin/user')
const util = require('~/util')

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

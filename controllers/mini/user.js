const service = require('~/service/mini/user')
const schema = require('~/validators/mini/user')
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
    ctx.body = await service.update(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

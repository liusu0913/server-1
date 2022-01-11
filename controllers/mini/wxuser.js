const service = require('~/service/mini/wxuser')
const schema = require('~/validators/mini/wxuser')
const util = require('~/util')

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

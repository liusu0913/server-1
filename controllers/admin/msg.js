const util = require('~/util')
const schema = require('~/validators/admin/msg')
const service = require('~/service/msg')

exports.sendMsg = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'sendMsg', data)
    ctx.body = await service.sendMsg(data)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

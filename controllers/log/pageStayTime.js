const service = require('~/service/log/log')
const schema = require('~/validators/log/pageStayTime')
const util = require('~/util')

exports.create = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'create', data)
    ctx.body = await service.stayTimeCreate(data)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

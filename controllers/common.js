const schema = require('~/validators/common/index')
const service = require('~/service/common/index')
const util = require('~/util')

exports.login = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'login', data)
    ctx.body = await service.login(data)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

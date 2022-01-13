const service = require('~/service/mini/common')
const schema = require('~/validators/mini/common')
const util = require('~/util')

exports.getUnionid = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'getUnionid', data)
    ctx.body = await service.getUnionid(data)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

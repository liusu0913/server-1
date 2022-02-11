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

exports.getMpOpenId = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'getMpOpenId', data)
    ctx.body = await service.getMpOpenId(data)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.getMpUserMsg = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'getMpOpenId', data)
    ctx.body = await service.getMpUserMsg(data)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.getMpSign = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'getMpSign', data)
    ctx.body = await service.getMpSign(data)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

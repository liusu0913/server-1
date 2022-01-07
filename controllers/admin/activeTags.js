const service = require('~/service/admin/activeTags')
const schema = require('~/validators/admin/activeTags')
const util = require('~/util')

exports.create = async (ctx) => {
  try {
    const data = ctx.request.body
    await util.validator.check(schema, 'create', data)
    ctx.body = await service.create(data, ctx)
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

exports.delete = async (ctx) => {
  try {
    const data = ctx.request.body
    const { activeId, tagId } = data
    await util.validator.check(schema, 'delete', data)
    if (tagId === undefined) {
      ctx.body = await service.delete({ activeId }, ctx)
    } else {
      ctx.body = await service.delete({ activeId, tagId }, ctx)
    }
  } catch (error) {
    ctx.body = util.format.errHandler(error)
  }
}

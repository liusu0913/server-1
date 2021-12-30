const { activeTags } = require('~/models')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)

module.exports = {
  async create (data, ctx) {
    try {
      const { session_user } = ctx
      const { activeId, tagIds } = data
      let count = 0
      let message = ''
      for (let i = 0; i < tagIds.length; i++) {
        const tag = tagIds[i]
        const res = await this.info({
          activeId,
          tagId: Number(tag)
        }, ctx)
        if (res.code === 0) {
          message += `标签${tag}已经被内容所绑定；`
          continue
        } else {
          await activeTags.create({
            activeId,
            tagId: Number(tag),
            belongCompany: session_user.belongCompany
          })
          count++
        }
      }
      return {
        code: 0,
        data: {
          count
        },
        message: message || 'success'
      }
    } catch (ex) {
      logger.error(`create|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async delete (where, ctx) {
    try {
      const { session_user } = ctx
      where = {
        ...where,
        belongCompany: session_user.belongCompany
      }
      const count = await activeTags.destroy({ where })
      if (count > 0) {
        return util.format.sucHandler({ count })
      } else {
        return util.format.errHandler('记录已被删除或不存在该记录!')
      }
    } catch (ex) {
      logger.error(`delete|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async info (where, ctx) {
    try {
      const { session_user } = ctx
      where = {
        ...where,
        belongCompany: session_user.belongCompany
      }
      const result = await activeTags.findOne({ where })
      if (result) {
        return util.format.sucHandler(result)
      } else {
        return util.format.errHandler('没有找到任何符合条件的记录!')
      }
    } catch (ex) {
      logger.error(`info|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  }
}

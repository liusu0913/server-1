const { activeRemind, active } = require('~/models')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)

module.exports = {
  async list (data, ctx) {
    try {
      const { session_user } = ctx
      data = util.format.dataProcessor(data)
      const { where } = data
      const result = await activeRemind.findAndCountAll({
        ...data,
        where: {
          ...where,
          belongCompany: session_user.belongCompany
        }
      })
      return util.format.sucHandler(result, 'list')
    } catch (ex) {
      logger.error(`list|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async create (data, ctx) {
    try {
      const { session_user } = ctx
      if (session_user.role) {
        data.belongCompany = session_user.belongCompany
      }
      const count = await activeRemind.count({
        where: {
          ...data
        }
      })
      if (count) {
        return await this.update(data, {
          activeId: data.activeId,
          jobId: data.jobId,
          type: data.type
        }, ctx)
      } else {
        const result = await activeRemind.create(data)
        return util.format.sucHandler(result)
      }
    } catch (ex) {
      logger.error(`create|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },

  async update (data, where = {}, ctx) {
    try {
      const { session_user } = ctx
      where = {
        ...where,
        belongCompany: session_user.belongCompany
      }
      const [count = 0] = await activeRemind.update(data, { where })
      if (count > 0) {
        return util.format.sucHandler({ count })
      } else {
        return util.format.errHandler('更新失败，没有找到可以更新的记录!')
      }
    } catch (ex) {
      logger.error(`update|error:${ex.message}|stack:${ex.stack}`)
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
      const [count = 0] = await activeRemind.destroy({ where })
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
      const result = await activeRemind.findOne({ where })
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

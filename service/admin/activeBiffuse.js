const { activeBiffuse } = require('~/models')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)

module.exports = {
  async list (data, ctx) {
    try {
      const { session_user } = ctx
      data = util.format.dataProcessor(data)
      const result = await activeBiffuse.findAndCountAll({
        ...data,
        where: {
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
      const result = await activeBiffuse.create(data)
      return util.format.sucHandler(result)
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
      const count = await activeBiffuse.destroy({ where })
      if (count > 0) {
        return util.format.sucHandler({ count })
      } else {
        return util.format.errHandler('记录已被删除或不存在该记录!')
      }
    } catch (ex) {
      logger.error(`delete|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  }
}

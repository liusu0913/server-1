const { user, company } = require('~/models')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)
const { WXREPEAT } = require('~/const/index')

module.exports = {
  async update (data, ctx) {
    try {
      const { session_user } = ctx
      const where = {
        jobId: session_user.jobId,
        belongCompany: session_user.belongCompany
      }
      if (data.openId) {
        const userInfo = await user.findOne({
          where: {
            openId: data.openId,
            belongCompany: session_user.belongCompany
          }
        })
        if (userInfo && userInfo.jobId && userInfo.jobId !== session_user.jobId) {
          return {
            code: WXREPEAT,
            message: `该微信已经绑定工号${userInfo.jobId}`
          }
        }
      }
      const [count = 0] = await user.update(data, { where })
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
  async info (where, ctx) {
    try {
      const { session_user } = ctx
      where = {
        ...where,
        belongCompany: session_user.belongCompany
      }
      const companyRes = await company.findOne({
        attributes: ['id', 'companyName', 'logo'],
        where: {
          id: session_user.belongCompany
        }
      })
      const result = await user.findOne({ where })
      result.company = companyRes
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

const { pvLog, wxuser, user, shareLog, stayMsgLog, questionLog, stayTimeLog } = require('~/models')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)
const wxUser = require('../admin/wxuser')
module.exports = {
  async viewCreate (data) {
    try {
      let staffInfo = await user.findOne({
        where: {
          jobId: data.jobId,
          belongCompany: data.belongCompany
        }
      })
      if (staffInfo) {
        staffInfo = util.format.sucHandler(staffInfo)
      }
      data.companyId = staffInfo.data.companyId
      data.company = staffInfo.data.company
      data.name = staffInfo.data.name

      const result = await pvLog.create(data)
      return util.format.sucHandler(result)
    } catch (ex) {
      logger.error(`create|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async shareCreate (data) {
    try {
      let staffInfo = await user.findOne({
        where: {
          jobId: data.jobId,
          belongCompany: data.belongCompany
        }
      })
      if (staffInfo) {
        staffInfo = util.format.sucHandler(staffInfo)
      }
      data.companyId = staffInfo.data.companyId
      data.company = staffInfo.data.company
      data.name = staffInfo.data.name
      const result = await shareLog.create(data)
      return util.format.sucHandler(result)
    } catch (ex) {
      logger.error(`create|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async stayTimeCreate (data) {
    try {
      const result = await stayTimeLog.create(data)
      return util.format.sucHandler(result)
    } catch (ex) {
      logger.error(`create|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async stayMsgCreate (data) {
    try {
      let staffInfo = await user.findOne({
        where: {
          jobId: data.jobId,
          belongCompany: data.belongCompany
        }
      })
      if (staffInfo) {
        staffInfo = util.format.sucHandler(staffInfo)
      }
      data.companyId = staffInfo.data.companyId
      data.company = staffInfo.data.company
      data.name = staffInfo.data.name
      const result = await stayMsgLog.create(data)
      const { openId, belongCompany } = data
      data.sourceJobId = data.jobId
      delete data.jobId
      delete data.name
      delete data.openId
      delete data.belongCompany
      wxUser.update(data, {
        openId,
        belongCompany
      })
      return util.format.sucHandler(result)
    } catch (ex) {
      logger.error(`create|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async questionCreate (data) {
    try {
      let staffInfo = await user.findOne({
        where: {
          jobId: data.jobId,
          belongCompany: data.belongCompany
        }
      })
      if (staffInfo) {
        staffInfo = util.format.sucHandler(staffInfo)
      }
      data.companyId = staffInfo.data.companyId
      data.company = staffInfo.data.company
      data.name = staffInfo.data.name
      const result = await questionLog.create(data)
      return util.format.sucHandler(result)
    } catch (ex) {
      logger.error(`create|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  }
}

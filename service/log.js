const { pvLog, user, shareLog } = require('~/models')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)

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
  }
}

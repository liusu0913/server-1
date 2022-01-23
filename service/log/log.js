const { pvLog, wxuser, user, shareLog, stayMsgLog, questionLog, stayTimeLog } = require('~/models')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)
const wxUser = require('../admin/wxuser')

async function isStaffInfo (where) {
  const count = await user.count({
    where
  })
  return !!count
}

async function beforeHandle (data) {
  data.belongCompany = Number(data.belongCompany)
  const isStaffPv = await isStaffInfo({
    openId: data.openId,
    belongCompany: data.belongCompany
  })
  if (isStaffPv) {
    return {
      code: 0,
      data: {},
      message: 'success'
    }
  }
  const { sourceOpenId } = data
  if (sourceOpenId) {
    const isStaffSource = await isStaffInfo({
      openId: sourceOpenId,
      belongCompany: data.belongCompany
    })
    if (isStaffSource) {
      delete data.sourceOpenId
    }
  }
  return {
    ...data
  }
}

module.exports = {
  async viewCreate (data) {
    try {
      data = await beforeHandle(data)
      if (data.code === 0) {
        return data
      }
      let staffInfo = await user.findOne({
        where: {
          jobId: data.jobId,
          belongCompany: data.belongCompany
        }
      })
      if (staffInfo) {
        staffInfo = util.format.sucHandler(staffInfo)
        data.companyId = staffInfo.data.companyId
        data.company = staffInfo.data.company
        data.name = staffInfo.data.name
      } else {
        data.companyId = ''
        data.company = ''
        data.name = ''
      }
      const result = await pvLog.create(data)
      return util.format.sucHandler(result)
    } catch (ex) {
      logger.error(`create|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async shareCreate (data) {
    try {
      data = await beforeHandle(data)
      if (data.code === 0) {
        return data
      }
      let staffInfo = await user.findOne({
        where: {
          jobId: data.jobId,
          belongCompany: data.belongCompany
        }
      })
      if (staffInfo) {
        staffInfo = util.format.sucHandler(staffInfo)
        data.companyId = staffInfo.data.companyId
        data.company = staffInfo.data.company
        data.name = staffInfo.data.name
      } else {
        data.companyId = ''
        data.company = ''
        data.name = ''
      }
      const result = await shareLog.create(data)
      return util.format.sucHandler(result)
    } catch (ex) {
      logger.error(`create|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async stayTimeCreate (data) {
    try {
      data = await beforeHandle(data)
      if (data.code === 0) {
        return data
      }
      let staffInfo = await user.findOne({
        where: {
          jobId: data.jobId,
          belongCompany: data.belongCompany
        }
      })
      if (staffInfo) {
        staffInfo = util.format.sucHandler(staffInfo)
        data.companyId = staffInfo.data.companyId
        data.company = staffInfo.data.company
        data.name = staffInfo.data.name
      } else {
        data.companyId = ''
        data.company = ''
        data.name = ''
      }
      data.stayTime = Number(data.stayTime)
      if (data.pageCount) {
        data.pageCount = Number(data.pageCount)
      }
      const result = await stayTimeLog.create(data)
      return util.format.sucHandler(result)
    } catch (ex) {
      logger.error(`create|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async stayMsgCreate (data) {
    try {
      data = await beforeHandle(data)
      if (data.code === 0) {
        return data
      }
      let staffInfo = await user.findOne({
        where: {
          jobId: data.jobId,
          belongCompany: data.belongCompany
        }
      })
      if (staffInfo) {
        staffInfo = util.format.sucHandler(staffInfo)
        data.companyId = staffInfo.data.companyId
        data.company = staffInfo.data.company
        data.name = staffInfo.data.name
      } else {
        data.companyId = ''
        data.company = ''
        data.name = ''
      }
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
      data = await beforeHandle(data)
      if (data.code === 0) {
        return data
      }
      let staffInfo = await user.findOne({
        where: {
          jobId: data.jobId,
          belongCompany: data.belongCompany
        }
      })
      if (staffInfo) {
        staffInfo = util.format.sucHandler(staffInfo)
        data.companyId = staffInfo.data.companyId
        data.company = staffInfo.data.company
        data.name = staffInfo.data.name
      } else {
        data.companyId = ''
        data.company = ''
        data.name = ''
      }
      const result = await questionLog.create(data)
      return util.format.sucHandler(result)
    } catch (ex) {
      logger.error(`create|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  }
}

const { wxuser, pvLog, shareLog, active, stayMsgLog } = require('~/models')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)
const { Op } = require('sequelize')

function formatData (arr, activeList) {
  let count = 0
  const list = []
  arr.forEach(item => {
    const obj = {}
    count += item.count
    obj.activeId = item.active_id
    const nameList = activeList.filter((active) => {
      return item.active_id === active.activeId
    })[0]
    obj.name = nameList ? nameList.title : '其他'
    obj.count = item.count
    list.push(obj)
  })
  return {
    list,
    count
  }
}

module.exports = {
  async wxuser (data, ctx) {
    try {
      const { session_user } = ctx
      const allCount = await wxuser.count({
        where: {
          belongCompany: session_user.belongCompany
        }
      })
      const phoneCount = await wxuser.count({
        where: {
          phone: {
            [Op.ne]: null
          },
          belongCompany: session_user.belongCompany
        }
      })
      return {
        code: 0,
        data: {
          allCount,
          phoneCount
        },
        message: 'success'
      }
    } catch (ex) {
      logger.error(`list|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async active (data, ctx) {
    try {
      const { session_user } = ctx
      const activeCount = await active.count({
        where: {
          belongCompany: session_user.belongCompany
        }
      })
      let pv = 0
      const pvRes = await pvLog.count({
        attributes: ['open_id'],
        group: ['open_id'],
        where: {
          belongCompany: session_user.belongCompany
        }
      })
      pvRes.forEach(item => {
        pv += item.count
      })
      const shareCount = await shareLog.count({
        where: {
          belongCompany: session_user.belongCompany
        }
      })
      return {
        code: 0,
        data: {
          activeCount,
          pv,
          uv: pvRes.length,
          shareCount

        },
        message: 'success'
      }
    } catch (ex) {
      logger.error(`list|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async activeDetails (data, ctx) {
    try {
      const { session_user } = ctx
      const { day } = data
      const searchRule = {
        belongCompany: session_user.belongCompany
      }
      if (day) {
        searchRule.createdAt = {
          [Op.gte]: new Date(new Date().getTime() - day * 24 * 60 * 60 * 1000)
        }
      }
      const activeList = await active.findAll({
        where: {
          belongCompany: session_user.belongCompany
        }
      })
      const pvRes = await pvLog.count({
        attributes: ['active_id'],
        group: ['active_id'],
        where: searchRule
      })
      const activeView = formatData(pvRes, activeList)
      const shareRes = await shareLog.count({
        attributes: ['active_id'],
        group: ['active_id'],
        where: searchRule
      })
      const activeShare = formatData(shareRes, activeList)
      const stayMsgRes = await stayMsgLog.count({
        attributes: ['active_id'],
        group: ['active_id'],
        where: searchRule
      })
      const activeStayMsg = formatData(stayMsgRes, activeList)

      return {
        code: 0,
        data: {
          activeView,
          activeShare,
          activeStayMsg
        },
        message: 'success'
      }
    } catch (ex) {
      logger.error(`list|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async rank (data, ctx) {
    try {
      const { session_user } = ctx
      const { day } = data
      const searchRule = {
        belongCompany: session_user.belongCompany
      }
      if (day) {
        searchRule.createdAt = {
          [Op.gte]: new Date(new Date().getTime() - day * 24 * 60 * 60 * 1000)
        }
      }
      const activeList = await active.findAll({
        where: {
          belongCompany: session_user.belongCompany
        }
      })
      const pvRes = await pvLog.count({
        attributes: ['active_id'],
        group: ['active_id'],
        where: searchRule,
        order: [['count', 'ASC']]
      })
      const { list } = formatData(pvRes, activeList)

      return {
        code: 0,
        data: {
          list: list.sort((a, b) => b.count - a.count)
        },
        message: 'success'
      }
    } catch (ex) {
      logger.error(`list|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  }
}

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
      const addCount = await wxuser.count({
        where: {
          belongCompany: session_user.belongCompany,
          createdAt: {
            [Op.gte]: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
          }
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
      const addPhoneCount = await wxuser.count({
        where: {
          updatedAt: {
            [Op.gte]: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
          },
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
          addCount,
          phoneCount,
          addPhoneCount
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
      const addActiveCount = await active.count({
        where: {
          createdAt: {
            [Op.gte]: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
          },
          belongCompany: session_user.belongCompany
        }
      })
      let pv = 0
      let addPv = 0
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
      const addPvRes = await pvLog.count({
        attributes: ['open_id'],
        group: ['open_id'],
        where: {
          createdAt: {
            [Op.gte]: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
          },
          belongCompany: session_user.belongCompany
        }
      })
      addPvRes.forEach(item => {
        addPv += item.count
      })
      const shareCount = await shareLog.count({
        where: {
          belongCompany: session_user.belongCompany
        }
      })
      const addShareCount = await shareLog.count({
        where: {
          createdAt: {
            [Op.gte]: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
          },
          belongCompany: session_user.belongCompany
        }
      })
      return {
        code: 0,
        data: {
          activeCount,
          addActiveCount,
          pv,
          addPv,
          uv: pvRes.length,
          addUv: addPvRes.length,
          shareCount,
          addShareCount
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
      const pvData = {}
      const uvData = {}
      let pvList = []
      let uvList = []
      const viewRes = await pvLog.count({
        attributes: ['active_id', 'open_id'],
        group: ['active_id', 'open_id'],
        where: searchRule
      })
      viewRes.forEach(item => {
        if (pvData[item.active_id]) {
          pvData[item.active_id].count += item.count
          uvData[item.active_id].count += 1
        } else {
          pvData[item.active_id] = item
          uvData[item.active_id] = {
            active_id: item.active_id,
            count: 1
          }
        }
      })
      Object.keys(pvData).forEach(key => {
        pvList.push(pvData[key])
      })
      Object.keys(uvData).forEach(key => {
        uvList.push(uvData[key])
      })
      const shareRes = await shareLog.count({
        attributes: ['active_id'],
        group: ['active_id'],
        where: searchRule
      })
      const stayMsgRes = await stayMsgLog.count({
        attributes: ['active_id'],
        group: ['active_id'],
        where: searchRule
      })

      pvList = formatData(pvList, activeList).list
      uvList = formatData(uvList, activeList).list
      const shareList = formatData(shareRes, activeList).list
      const stayMsgList = formatData(stayMsgRes, activeList).list

      return {
        code: 0,
        data: {
          pvList: pvList.sort((a, b) => b.count - a.count),
          uvList: uvList.sort((a, b) => b.count - a.count),
          shareList: shareList.sort((a, b) => b.count - a.count),
          stayMsgList: stayMsgList.sort((a, b) => b.count - a.count)
        },
        message: 'success'
      }
    } catch (ex) {
      logger.error(`list|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  }
}

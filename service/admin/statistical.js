const { pvLog, shareLog, active, stayMsgLog, user } = require('~/models')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)
const moment = require('moment')

const { Op } = require('sequelize')

function formatData (arr, activeList) {
  let count = 0
  const list = []
  arr.forEach(item => {
    const obj = {}
    const nameList = activeList.filter((active) => {
      return item.active_id === active.activeId
    })[0]
    if (!nameList) {
      return
    }
    count += item.count
    obj.activeId = item.active_id
    obj.active = nameList
    obj.name = nameList ? nameList.title : '未知活动'
    obj.count = item.count
    list.push(obj)
  })
  return {
    list,
    count
  }
}

function getInArr (id) {
  const inArr = []
  for (let i = 0; i < id.length; i++) {
    inArr.push(id.slice(0, i + 1))
  }
  return inArr
}

module.exports = {
  async user (ctx) {
    try {
      const { session_user } = ctx
      const where = {
        companyId: {
          [Op.like]: `${session_user.companyId}%`
        },
        role: 3,
        status: '1',
        belongCompany: session_user.belongCompany
      }
      const allCount = await user.count({
        where
      })
      const addCount = await user.count({
        where: {
          ...where,
          createdAt: {
            [Op.gte]: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
          }
        }
      })
      const loginCount = await user.count({
        where: {
          ...where,
          openId: {
            [Op.ne]: null
          }
        }
      })
      const addLoginCount = await user.count({
        where: {
          ...where,
          updatedAt: {
            [Op.gte]: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
          },
          openId: {
            [Op.ne]: null
          }
        }
      })
      return {
        code: 0,
        data: {
          allCount,
          addCount,
          loginCount,
          addLoginCount
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
      const where = {
        disabled: '1',
        createCompanyCode: {
          [Op.or]: {
            [Op.like]: `${session_user.companyId}%`,
            [Op.in]: getInArr(session_user.companyId)
          }
        },
        belongCompany: session_user.belongCompany
      }
      const activeList = await active.findAll({
        where
      })
      const addActiveCount = await active.count({
        where: {
          ...where,
          createdAt: {
            [Op.gte]: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
          }
        }
      })
      let pv = 0
      let addPv = 0
      const logWhere = {
        belongCompany: session_user.belongCompany,
        disabled: '1',
        companyId: {
          [Op.like]: `${session_user.companyId}%`
        }
      }
      const pvRes = await pvLog.count({
        attributes: ['open_id'],
        group: ['open_id'],
        where: logWhere,
        include: [{
          model: active,
          as: 'active',
          where
        }]
      })
      pvRes.forEach(item => {
        pv += item.count
      })
      const addPvRes = await pvLog.count({
        attributes: ['open_id'],
        group: ['open_id'],
        where: {
          ...logWhere,
          createdAt: {
            [Op.gte]: new Date(moment(new Date()).format('YYYY-MM-DD'))
          }
        },
        include: [{
          model: active,
          as: 'active',
          where
        }]
      })
      addPvRes.forEach(item => {
        addPv += item.count
      })
      const shareCount = await shareLog.count({
        where: logWhere,
        include: [{
          model: active,
          as: 'active',
          where
        }]
      })
      const addShareCount = await shareLog.count({
        where: {
          ...logWhere,
          createdAt: {
            [Op.gte]: new Date(moment(new Date()).format('YYYY-MM-DD'))
          }
        },
        include: [{
          model: active,
          as: 'active',
          where
        }]
      })
      return {
        code: 0,
        data: {
          activeCount: activeList.length,
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
        disabled: '1',
        belongCompany: session_user.belongCompany,
        companyId: {
          [Op.like]: `${session_user.companyId}%`
        }
      }
      if (day) {
        if (day === 1) {
          searchRule.createdAt = {
            [Op.gte]: new Date(moment(new Date()).format('YYYY-MM-DD'))
          }
        } else {
          searchRule.createdAt = {
            [Op.gte]: new Date(new Date().getTime() - day * 24 * 60 * 60 * 1000)
          }
        }
      }
      const activeList = await active.findAll({
        where: {
          disabled: '1',
          createCompanyCode: {
            [Op.or]: {
              [Op.like]: `${session_user.companyId}%`,
              [Op.in]: getInArr(session_user.companyId)
            }
          },
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
        disabled: '1',
        belongCompany: session_user.belongCompany,
        companyId: {
          [Op.like]: `${session_user.companyId}%`
        }
      }
      if (day) {
        if (day === 1) {
          searchRule.createdAt = {
            [Op.gte]: new Date(moment(new Date()).format('YYYY-MM-DD'))
          }
        } else {
          searchRule.createdAt = {
            [Op.gte]: new Date(new Date().getTime() - day * 24 * 60 * 60 * 1000)
          }
        }
      }
      const activeList = await active.findAll({
        where: {
          disabled: '1',
          createCompanyCode: {
            [Op.or]: {
              [Op.like]: `${session_user.companyId}%`,
              [Op.in]: getInArr(session_user.companyId)
            }
          },
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

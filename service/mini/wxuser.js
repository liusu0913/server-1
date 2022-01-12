const { wxuser, pvLog, active, stayMsgLog, questionLog, shareLog } = require('~/models')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)
const { Op } = require('sequelize')

function formatTime (time) {
  time = new Date(time)
  const y = time.getFullYear()
  const m = time.getMonth() + 1
  const d = time.getDate()
  return `${y}-${m}-${d}`
}

function formatActive (pvList) {
  const now = new Date().getTime()
  let active = 0
  let weekActive = 0
  let monthActive = 0
  for (let i = 0; i < 30; i++) {
    const filterTime = now - i * 24 * 60 * 60 * 1000
    const activeArr = []
    const list = pvList.filter((pv) => {
      return formatTime(pv.updatedAt) === formatTime(filterTime)
    })
    list.forEach((pv) => {
      if (activeArr.indexOf(pv.activeId) === -1) {
        activeArr.push(pv.activeId)
      }
    })
    // pv/(H5个数*（e^((t-1)*0.1））)
    if (list.length) {
      active += Math.floor(list.length / ((activeArr.length) * Math.floor(Math.pow(Math.E, (i) * 0.1))))
    }
    if (i === 6) {
      weekActive = active
    }
  }
  monthActive = active
  return {
    weekActive,
    monthActive
  }
}

module.exports = {
  async info (where, ctx) {
    try {
      const { session_user } = ctx
      where = {
        ...where,
        belongCompany: session_user.belongCompany
      }
      const result = await wxuser.findOne({ where })
      const effectCount = await pvLog.count({
        where: {
          belongCompany: session_user.belongCompany,
          sourceOpenId: where.openId
        }
      })
      const pvList = await pvLog.findAll({
        where: {
          ...where,
          updatedAt: {
            [Op.gte]: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })

      if (result) {
        const res = util.format.sucHandler(result)
        const { openId, name, avatar, phone, content, sourceOpenId } = res.data
        return {
          code: res.code,
          data: {
            openId,
            name,
            avatar,
            phone,
            content,
            sourceOpenId,
            ...formatActive(pvList),
            effectCount
          },
          message: res.message
        }
      } else {
        return util.format.errHandler('没有找到任何符合条件的记录!')
      }
    } catch (ex) {
      logger.error(`info|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async visitHistroy (data, ctx) {
    try {
      const { session_user } = ctx
      data = util.format.dataProcessor(data)
      const { where } = data
      const stayMsgActiveList = await stayMsgLog.findAll({
        where: {
          ...where,
          belongCompany: session_user.belongCompany
        }
      })
      const questionActiveList = await questionLog.findAll({
        where: {
          ...where,
          belongCompany: session_user.belongCompany
        }
      })
      const shareActiveList = await shareLog.findAll({
        where: {
          ...where,
          belongCompany: session_user.belongCompany
        }
      })
      const result = await pvLog.findAndCountAll({
        ...data,
        where: {
          ...where,
          belongCompany: session_user.belongCompany
        },
        distinct: true,
        include: [{
          attributes: ['title'],
          model: active,
          as: 'active',
          where: {
            belongCompany: session_user.belongCompany
          },
          required: false
        }, {
          attributes: ['name'],
          model: wxuser,
          as: 'sourceUser',
          where: {
            belongCompany: session_user.belongCompany
          },
          required: false
        }]
      })
      const res = util.format.sucHandler(result, 'list')
      const list = []
      if (res.code === 0) {
        res.data.list.forEach((item) => {
          const tags = []
          const stayMsg = stayMsgActiveList.filter(active => active.activeId === item.activeId)
          const question = questionActiveList.filter(active => active.activeId === item.activeId)
          const share = shareActiveList.filter(active => active.activeId === item.activeId)
          if (stayMsg.length) {
            tags.push('已留资')
          }
          if (question.length) {
            tags.push('已参与')
          }
          if (share.length) {
            tags.push('已分享')
          }
          list.push({
            activeId: item.activeId,
            active: item.active,
            sourceOpenId: item.sourceOpenId,
            sourceUser: item.sourceUser,
            updatedAt: item.updatedAt,
            tags
          })
        })
      }

      return {
        code: res.code,
        data: {
          list,
          count: res.data.count
        },
        message: res.message
      }
    } catch (ex) {
      logger.error(`list|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  }
}

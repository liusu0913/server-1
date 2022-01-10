const { activeRemind, remindTime, active } = require('~/models')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)
const { Op } = require('sequelize')

async function getTime (where) {
  const res = await remindTime.findOne({
    where
  })
  return res.updatedAt
}

async function getRemindCount (where, time) {
  const all = await activeRemind.count({
    where
  })
  const unread = await activeRemind.count({
    where: {
      ...where,
      updatedAt: {
        [Op.gte]: time
      }
    }
  })
  return {
    all,
    unread
  }
}

module.exports = {
  async getMsgCount (ctx) {
    try {
      const { session_user } = ctx
      const moreSendTime = await getTime({
        type: 1,
        jobId: session_user.jobId,
        belongCompany: session_user.belongCompany
      })
      const moreSend = await getRemindCount({
        type: 1,
        jobId: session_user.jobId,
        belongCompany: session_user.belongCompany
      }, moreSendTime)

      const firendTime = await getTime({
        type: 2,
        jobId: session_user.jobId,
        belongCompany: session_user.belongCompany
      })
      const firend = await getRemindCount({
        type: 2,
        jobId: session_user.jobId,
        belongCompany: session_user.belongCompany
      }, firendTime)

      return {
        moreSend,
        firend
      }
    } catch (ex) {
      logger.error(`update|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async list (data, ctx) {
    try {
      const { session_user } = ctx
      data = util.format.dataProcessor(data)
      const { where } = data
      const readTimeRes = await remindTime.findOne({
        where: {
          ...where,
          jobId: session_user.jobId,
          belongCompany: session_user.belongCompany
        }
      })
      const prevReadTime = readTimeRes.updatedAt
      const result = await activeRemind.findAndCountAll({
        ...data,
        distinct: true,
        order: [['updatedAt', 'ASC']],
        where: {
          ...where,
          jobId: session_user.jobId,
          belongCompany: session_user.belongCompany
        },
        include: [{
          model: active,
          as: 'active',
          where: {
            belongCompany: session_user.belongCompany
          }
        }]
      })
      const res = util.format.sucHandler(result, 'list')
      const formatList = []
      res.data.list.forEach(item => {
        let newMsg = false
        if (item.updatedAt > prevReadTime) {
          newMsg = true
        } else {
          newMsg = false
        }
        formatList.push({
          active: item.active,
          type: item.type,
          updatedAt: item.updatedAt,
          createdAt: item.createdAt,
          jobId: item.jobId,
          newMsg
        })
      })
      return {
        code: res.code,
        data: {
          list: formatList
        },
        count: res.count
      }
      return res
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
      const { jobIds } = data
      let count = 0
      delete data.jobIds
      console.log(jobIds)
      for (let i = 0; i < jobIds.length; i++) {
        data.jobId = jobIds[i]
        let res = await activeRemind.create(data)
        res = util.format.sucHandler(res)
        if (res.code === 0) {
          count++
        }
      }
      return {
        code: 0,
        data: {
          count
        },
        message: 'success'
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

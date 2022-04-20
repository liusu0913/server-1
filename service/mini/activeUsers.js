const { Op } = require('sequelize')
const { wxuser, pvLog, active, shareLog } = require('~/models')

module.exports = {
  async recommend (body, ctx) {
    const { session_user } = ctx
    const activeUserList = []
    const where = {
      belongCompany: session_user.belongCompany,
      jobId: session_user.jobId,
      createdAt: {
        [Op.gte]: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
      }
    }

    const userList = await wxuser.findAll({
      where: {
        belongCompany: session_user.belongCompany,
        sourceJobId: session_user.jobId,
        phone: {
          [Op.ne]: null,
          [Op.ne]: ''
        }
      },
      include: [{
        attributes: ['openId', 'createdAt', 'activeId'],
        model: pvLog,
        limit: 1,
        where: {
          belongCompany: session_user.belongCompany
        },
        order: [['createdAt', 'DESC']],
        as: 'record',
        include: [{
          attributes: ['title'],
          model: active,
          where: {
            belongCompany: session_user.belongCompany
          },
          as: 'active'
        }]
      }]
    })

    for (let i = 0; i < userList.length; i++) {
      const user = userList[i]
      const pvCount = await pvLog.count({
        where: {
          ...where,
          openId: user.openId
        }
      })
      const shareCount = await shareLog.count({
        where: {
          ...where,
          openId: user.openId
        }
      })
      if (pvCount * 0.5 + shareCount >= 2) {
        activeUserList.push(user)
      }
    }

    return {
      code: 0,
      message: 'success',
      data: {
        total: activeUserList.length,
        users: activeUserList
      }
    }
  },

  async regular (body, ctx) {
    const { session_user } = ctx
    const userList = await wxuser.findAll({
      where: {
        belongCompany: session_user.belongCompany,
        sourceJobId: session_user.jobId,
        phone: {
          [Op.ne]: null,
          [Op.ne]: ''
        }
      },
      include: [{
        attributes: ['openId', 'createdAt', 'activeId'],
        model: pvLog,
        limit: 1,
        where: {
          belongCompany: session_user.belongCompany
        },
        order: [['createdAt', 'DESC']],
        as: 'record',
        include: [{
          attributes: ['title'],
          model: active,
          where: {
            belongCompany: session_user.belongCompany
          },
          as: 'active'
        }]
      }]
    })

    return {
      code: 0,
      message: 'success',
      data: {
        total: userList.length,
        users: userList
      }
    }
  },

  async share (body, ctx) {
    const { session_user } = ctx
    const activeUserList = []
    const where = {
      belongCompany: session_user.belongCompany,
      jobId: session_user.jobId,
      createdAt: {
        [Op.gte]: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
      }
    }

    const userList = await wxuser.findAll({
      where: {
        belongCompany: session_user.belongCompany,
        sourceJobId: session_user.jobId,
        phone: {
          [Op.ne]: null,
          [Op.ne]: ''
        }
      },
      include: [{
        attributes: ['openId', 'createdAt', 'activeId'],
        model: pvLog,
        limit: 1,
        where: {
          belongCompany: session_user.belongCompany
        },
        order: [['createdAt', 'DESC']],
        as: 'record',
        include: [{
          attributes: ['title'],
          model: active,
          where: {
            belongCompany: session_user.belongCompany
          },
          as: 'active'
        }]
      }]
    })

    for (let i = 0; i < userList.length; i++) {
      const user = userList[i]
      const shareCount = await shareLog.count({
        where: {
          ...where,
          openId: user.openId
        }
      })
      if (shareCount >= 3) {
        activeUserList.push(user)
      }
    }
    return {
      code: 0,
      message: 'success',
      data: {
        total: activeUserList.length,
        users: activeUserList
      }
    }
  },

  async tags (body, ctx) {
    const { session_user } = ctx
    const openId = body.openId

    const where = {
      openId: openId,
      belongCompany: session_user.belongCompany
    }

    let pvRecord = await pvLog.count({
      group: ['active_id'],
      where
    })

    pvRecord.sort((a, b) => {
      return b.count - a.count
    })

    pvRecord = pvRecord.slice(0, 3)
    const tagMap = {}

    for (let i = 0; i < pvRecord.length; i++) {
      const pv = pvRecord[i]
      const activeInfo = await active.findOne({
        where: {
          activeId: pv.active_id,
          belongCompany: session_user.belongCompany
        }
      })
      const { userTags } = activeInfo
      if (userTags) {
        const tags = JSON.parse(userTags)
        tags.forEach(tag => {
          if (tagMap[tag]) {
            tagMap[tag] = pv.count + tagMap[tag]
          } else {
            tagMap[tag] = pv.count
          }
        })
      }
    }

    const tagRank = []

    Object.keys(tagMap).forEach((key) => {
      tagRank.push({
        tag: key,
        count: tagMap[key]
      })
    })
    tagRank.sort((a, b) => {
      return b.count - a.count
    })

    return {
      code: 0,
      message: 'success',
      data: tagRank.slice(0, 3)
    }
  }
}

const { active, activeTags, activeRemind, tags, activeType, pvLog, shareLog, stayMsgLog, questionLog, stayTimeLog } = require('~/models')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)
const { Op } = require('sequelize')

function getInArr (id) {
  const inArr = []
  for (let i = 0; i < id.length; i++) {
    inArr.push(id.slice(0, i + 1))
  }
  return inArr
}

module.exports = {
  async batchDelete (data, ctx) {
    try {
      const { session_user } = ctx
      const { activeIds } = data
      const where = {
        activeId: {
          [Op.in]: activeIds
        },
        belongCompany: session_user.belongCompany
      }
      const [count = 0] = await active.update({
        disabled: '0'
      }, { where })
      if (count > 0) {
        activeRemind.update({ disabled: '0' }, { where })
        activeTags.update({ disabled: '0' }, { where })
        pvLog.update({ disabled: '0' }, { where })
        shareLog.update({ disabled: '0' }, { where })
        stayMsgLog.update({ disabled: '0' }, { where })
        stayTimeLog.update({ disabled: '0' }, { where })
        questionLog.update({ disabled: '0' }, { where })
        return util.format.sucHandler({ count })
      } else {
        return util.format.errHandler('更新失败，没有找到可以更新的记录!')
      }
    } catch (ex) {
      logger.error(`delete|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async list (data, ctx) {
    try {
      const { session_user } = ctx
      data = util.format.dataProcessor(data)
      const searchArr = ['title', 'activeId']
      const { where } = data
      where.disabled = '1'
      searchArr.forEach(key => {
        if (where[key]) {
          where[key] = {
            [Op.like]: `${where[key]}%`
          }
        }
      })
      const result = await active.findAndCountAll({
        ...data,
        where: {
          ...where,
          belongCompany: session_user.belongCompany,
          createCompanyCode: {
            [Op.or]: {
              [Op.like]: `${session_user.companyId}%`,
              [Op.in]: getInArr(session_user.companyId)
            }
          }
        },
        distinct: true,
        include: [{
          attributes: ['tagId'],
          model: activeTags,
          as: 'tags',
          where: {
            belongCompany: session_user.belongCompany
          },
          required: false,
          include: [{
            attributes: ['id', 'name'],
            model: tags,
            as: 'tag',
            where: {
              belongCompany: session_user.belongCompany
            },
            required: false
          }]
        }, {
          attributes: ['title'],
          model: activeType,
          as: 'type',
          where: {
            // belongCompany: session_user.belongCompany
          },
          required: false
        }]
      })
      return util.format.sucHandler(result, 'list')
    } catch (ex) {
      logger.error(`list|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async create (data, ctx) {
    try {
      data.activeId = util.user.createUID()
      const { session_user } = ctx
      data.belongCompany = session_user.belongCompany
      data.createId = session_user.jobId
      data.createCompanyCode = session_user.companyId
      if (data.userTags && Array.isArray(data.userTags)) {
        data.userTags = JSON.stringify(data.userTags)
      }
      const result = await active.create(data)
      return util.format.sucHandler(result)
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
      if (data.userTags) {
        data.userTags = JSON.stringify(data.userTags)
      }
      const [count = 0] = await active.update(data, { where })
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
      const [count = 0] = await active.update({
        disabled: '0'
      }, { where })
      if (count > 0) {
        activeRemind.update({ disabled: '0' }, { where })
        pvLog.update({ disabled: '0' }, { where })
        shareLog.update({ disabled: '0' }, { where })
        stayMsgLog.update({ disabled: '0' }, { where })
        stayTimeLog.update({ disabled: '0' }, { where })
        questionLog.update({ disabled: '0' }, { where })
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
      const result = await active.findOne({ where })
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

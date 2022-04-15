const { fodder, tags, fodderTag } = require('~/models')
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
  async list (data, ctx) {
    try {
      const { session_user } = ctx
      const { search, tagId } = data
      delete data.search
      delete data.tagId
      let list = []
      let count = 0
      let code = 0
      let message = ''
      data = util.format.dataProcessor(data)
      let { where } = data
      where = {
        ...where,
        createCompanyCode: {
          [Op.or]: {
            [Op.like]: `${session_user.companyId}%`,
            [Op.in]: getInArr(session_user.companyId)
          }
        },
        belongCompany: session_user.belongCompany
      }
      if (search) {
        const result = await fodder.findAndCountAll({
          ...data,
          order: [['updatedAt', 'DESC']],
          where: {
            ...where,
            title: {
              [Op.like]: `%${search}%`
            }
          },
          distinct: true,
          include: [{
            attributes: ['tagId'],
            model: fodderTag,
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
          }]
        })
        return util.format.sucHandler(result, 'list')
      } else {
        const result = await fodder.findAndCountAll({
          ...data,
          order: [['updatedAt', 'DESC']],
          where: {
            ...where
          },
          distinct: true,
          include: [{
            attributes: ['tagId'],
            model: fodderTag,
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
          }]
        })
        const res = util.format.sucHandler(result, 'list')
        if (tagId) {
          list = res.data.list.filter(item => {
            const listTags = item.tags.filter((tag) => tag.tagId === tagId)
            return listTags.length
          })
        } else {
          list = res.data.list
        }
        count = res.data.count
        code = res.code
        message = res.message
      }
      return {
        code,
        data: {
          list,
          count
        },
        message
      }
    } catch (ex) {
      logger.error(`list|error:${ex.message}|stack:${ex.stack}`)
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
      const result = await fodder.findOne({ where })
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

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
  async batchDelete (data, ctx) {
    try {
      const { session_user } = ctx
      const { fodderIds } = data
      const where = {
        fodderId: {
          [Op.in]: fodderIds
        },
        belongCompany: session_user.belongCompany
      }
      const count = await fodder.destroy({ where })
      fodder.destroy({ where })
      return util.format.sucHandler({ count })
    } catch (ex) {
      logger.error(`delete|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async list (data, ctx) {
    try {
      const { session_user } = ctx
      data = util.format.dataProcessor(data)
      const searchArr = ['title', 'fodderId']
      const { where } = data
      searchArr.forEach(key => {
        if (where[key]) {
          where[key] = {
            [Op.like]: `${where[key]}%`
          }
        }
      })
      const result = await fodder.findAndCountAll({
        ...data,
        order: [['updatedAt', 'DESC']],
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
    } catch (ex) {
      logger.error(`list|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async create (data, ctx) {
    try {
      data.fodderId = util.user.createUID()
      const { session_user } = ctx
      data.belongCompany = session_user.belongCompany
      data.createId = session_user.jobId
      data.createCompanyCode = session_user.companyId
      if (data.imgs) {
        data.imgs = JSON.stringify(data.imgs)
      }
      const result = await fodder.create(data)
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
      if (data.imgs) {
        data.imgs = JSON.stringify(data.imgs)
      }
      const count = await fodder.update(data, { where })
      if (count > 0) {
        return util.format.sucHandler({ count })
      } else {
        return util.format.errHandler('????????????????????????????????????????????????!')
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
      const count = await fodder.destroy({ where })
      if (count > 0) {
        return util.format.sucHandler({ count })
      } else {
        return util.format.errHandler('???????????????????????????????????????!')
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
      const result = await fodder.findOne({ where })
      if (result) {
        return util.format.sucHandler(result)
      } else {
        return util.format.errHandler('???????????????????????????????????????!')
      }
    } catch (ex) {
      logger.error(`info|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  }
}

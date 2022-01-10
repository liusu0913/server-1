const { active, tags, activeType, activeTags } = require('~/models')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)
const { Op } = require('sequelize')

function forMatActiveData (active) {
  const tags = []
  console.log(active)
  active.tags.forEach((tag) => {
    tags.push(tag.tag)
  })
  return {
    activeId: active.activeId,
    title: active.title,
    url: active.url,
    img: active.img,
    tags,
    type: active.type,
    diffuseTypeId: active.diffuseTypeId,
    startTime: active.startTime,
    createdAt: active.createdAt,
    updatedAt: active.updatedAt
  }
}

module.exports = {
  async list (data, ctx) {
    try {
      const { session_user } = ctx
      const { search } = data
      const list = []
      let count = 0
      delete data.search
      if (search) {
        const result = await active.findAndCountAll({
          ...data,
          where: {
            title: {
              [Op.like]: `%${search}%`
            },
            belongCompany: session_user.belongCompany
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
              belongCompany: session_user.belongCompany
            },
            required: false
          }]
        })
        const res = util.format.sucHandler(result, 'list')
        count = res.count
        res.data.list.forEach((item) => {
          list.push(forMatActiveData(item))
        })
      } else {
        data = util.format.dataProcessor(data)
        const { where } = data
        const result = await activeTags.findAndCountAll({
          ...data,
          where: {
            ...where,
            belongCompany: session_user.belongCompany
          },
          include: [{
            model: active,
            as: 'active',
            where: {
              belongCompany: session_user.belongCompany
            },
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
                belongCompany: session_user.belongCompany
              },
              required: false
            }]
          }],
          distinct: true,
          order: [['updatedAt', 'ASC']]
        })
        const res = util.format.sucHandler(result, 'list')
        count = res.count
        res.data.list.forEach((item) => {
          const { active } = item
          list.push(forMatActiveData(active))
        })
      }

      return {
        code: 0,
        data: {
          list
        },
        count
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

const { active, tags, activeType, activeTags, pvLog, shareLog, stayMsgLog } = require('~/models')
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

function forMatActiveData (active, uv, share, stayMsg) {
  const tags = []
  active.tags.forEach((tag) => {
    if (tag.tag) {
      tags.push(tag.tag)
    }
  })
  return {
    thumbnail: active.thumbnail,
    banner: active.banner,
    activeId: active.activeId,
    title: active.title,
    url: active.url,
    img: active.img,
    tags,
    uv,
    share,
    stayMsg,
    type: active.type,
    diffuseTypeId: active.diffuseTypeId,
    startTime: active.startTime,
    endTime: active.endTime,
    createdAt: active.createdAt,
    updatedAt: active.updatedAt
  }
}

module.exports = {
  async data (data, ctx) {
    try {
      const { session_user } = ctx
      const { day } = data
      const where = {
        jobId: session_user.jobId,
        belongCompany: session_user.belongCompany,
        disabled: '1'
      }
      if (day) {
        where.createdAt = {
          [Op.gte]: new Date(new Date().getTime() - day * 24 * 60 * 60 * 1000)
        }
      }
      const pv = await pvLog.count({
        group: ['open_id'],
        where
      })
      const share = await shareLog.count({
        where
      })
      const shareActive = await pvLog.count({
        group: ['active_id'],
        where
      })
      return {
        code: 0,
        data: {
          uv: pv.length,
          share,
          shareActiveCount: shareActive.length
        },
        message: 'success'
      }
    } catch (error) {
    }
  },
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
            endTime: {
              [Op.is]: null
            },
            createCompanyCode: {
              [Op.or]: {
                [Op.like]: `${session_user.companyId}%`,
                [Op.in]: getInArr(session_user.companyId)
              }
            },
            belongCompany: session_user.belongCompany,
            disabled: '1'
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
        const res = util.format.sucHandler(result, 'list')
        count = res.data.count
        res.data.list.forEach((item) => {
          list.push(forMatActiveData(item, session_user))
        })
      } else {
        data = util.format.dataProcessor(data)
        const { where } = data
        const result = await activeTags.findAndCountAll({
          ...data,
          where: {
            ...where,
            disabled: '1',
            belongCompany: session_user.belongCompany
          },
          include: [{
            model: active,
            as: 'active',
            where: {
              endTime: {
                [Op.is]: null
              },
              disabled: '1',
              createCompanyCode: {
                [Op.or]: {
                  [Op.like]: `${session_user.companyId}%`,
                  [Op.in]: getInArr(session_user.companyId)
                }
              },
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
                // belongCompany: session_user.belongCompany
              },
              required: false
            }]
          }],
          distinct: true,
          order: [['updatedAt', 'ASC']]
        })
        const res = util.format.sucHandler(result, 'list')
        count = res.data.count
        for (let i = 0; i < res.data.list.length; i++) {
          const { active } = res.data.list[i]
          const dataQuery = {
            group: ['open_id'],
            where: {
              activeId: active.activeId,
              belongCompany: session_user.belongCompany
            }
          }
          const uvRes = await pvLog.count(dataQuery)
          const shareRes = await shareLog.count(dataQuery)
          const stayMsgRes = await stayMsgLog.count(dataQuery)
          list.push(forMatActiveData(active, uvRes.length, shareRes.length, stayMsgRes.length))
        }
      }

      return {
        code: 0,
        data: {
          list,
          count,
          session_user
        },
        message: 'success'
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

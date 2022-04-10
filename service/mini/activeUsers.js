const sequelize = require('~/libs/db')
const { QueryTypes, Op } = require('sequelize')
const users = require('../admin/user')
const { wxuser, pvLog, active } = require('~/models')

module.exports = {
  async recommend (body, ctx) {
    const limit = body.count
    const offset = body.offset
    const { session_user } = ctx
    const jobId = session_user.jobId
    const belongCompany = session_user.belongCompany
    const companyId = session_user.companyId + '%'
    const date = new Date()
    date.setDate(date.getDate() - 7)
    const sevenDaysAgo = date.toISOString().slice(0, 10)
    date.setDate(date.getDate() - 23)
    const thirtyDaysAgo = date.toISOString().slice(0, 10)
    const where = ' where job_id = ? and belong_company = ? and company_id like ? and date (updated_at) > ? '
    const total = await sequelize.query(`select count(*) as total
                                         from (select open_id
                                               from stayTimeLog` + where +
      'group by open_id having sum(stay_time) > 30 union select open_id from questionLog' + where +
      'union select source_open_id from pvLog' + where + ') a left join wxuser b on a.open_id = b.open_id where b.open_id is not null',
    {
      replacements: [jobId, belongCompany, companyId, sevenDaysAgo, jobId, belongCompany, companyId, sevenDaysAgo,
        jobId, belongCompany, companyId, thirtyDaysAgo],
      type: QueryTypes.SELECT
    })
    const data = {
      total: total[0].total
    }
    const openID = await sequelize.query(`select a.open_id as open_id
                                          from (select open_id
                                                from stayTimeLog` + where +
      'group by open_id having sum(stay_time) > 30 union select open_id from questionLog' + where +
      'union select source_open_id from pvLog' + where + ') a left join wxuser b on a.open_id = b.open_id where b.open_id is not null limit ? offset ?',
    {
      replacements: [jobId, belongCompany, companyId, sevenDaysAgo, jobId, belongCompany, companyId, sevenDaysAgo,
        jobId, belongCompany, companyId, thirtyDaysAgo, limit, offset],
      type: QueryTypes.SELECT
    })
    const openIDs = []
    for (const v of openID) {
      openIDs.push(v.open_id)
    }
    const result = await wxuser.findAll({
      where: {
        open_id: {
          [Op.in]: openIDs
        }
      },
      include: [{
        attributes: ['openId', 'updatedAt', 'activeId'],
        model: pvLog,
        limit: 1,
        where: {
          belongCompany: session_user.belongCompany
        },
        order: [['updatedAt', 'DESC']],
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
    data.users = result
    return {
      code: 0,
      message: 'success',
      data: data
    }
  },

  async regular (body, ctx) {
    const limit = body.count
    const offset = body.offset
    const { session_user } = ctx
    const jobId = session_user.jobId
    const belongCompany = session_user.belongCompany
    const companyId = session_user.companyId + '%'
    const where = ' where job_id = ? and belong_company = ? and company_id like ? '
    const total = await sequelize.query(`select count(*) as total
                                         from (select distinct open_id from stayMsgLog` + where +
      ') a left join wxuser b on a.open_id = b.open_id where b.open_id is not null',
    {
      replacements: [jobId, belongCompany, companyId],
      type: QueryTypes.SELECT
    })
    const data = {
      total: total[0].total
    }
    const openID = await sequelize.query(`select b.*
                                          from (select distinct open_id
                                                from stayMsgLog` + where +
      ') a join wxuser b on a.open_id = b.open_id where b.open_id is not null limit ? offset ?',
    {
      replacements: [jobId, belongCompany, companyId, limit, offset],
      type: QueryTypes.SELECT
    })
    const openIDs = []
    for (const v of openID) {
      openIDs.push(v.open_id)
    }
    const result = await wxuser.findAll({
      where: {
        open_id: {
          [Op.in]: openIDs
        }
      },
      include: [{
        attributes: ['openId', 'updatedAt', 'activeId'],
        model: pvLog,
        limit: 1,
        where: {
          belongCompany: session_user.belongCompany
        },
        order: [['updatedAt', 'DESC']],
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
    data.users = result
    return {
      code: 0,
      message: 'success',
      data: data
    }
  },

  async share (body, ctx) {
    const limit = body.count
    const offset = body.offset
    const { session_user } = ctx
    const jobId = session_user.jobId
    const belongCompany = session_user.belongCompany
    const companyId = session_user.companyId + '%'
    const date = new Date()
    date.setDate(date.getDate() - 7)
    const sevenDaysAgo = date.toISOString().slice(0, 10)
    const where = ' where job_id = ? and belong_company = ? and company_id like ? and source_open_id != ? '
    const whereWithDate = where + ' and date (updated_at) > ? '
    const openID = await users.infoMini({ jobId, belongCompany })
    const total = await sequelize.query(`select count(*) as total
                                         from (select source_open_id
                                               from pvLog` + whereWithDate +
      'group by source_open_id having count(*) > 2 union (select source_open_id from pvLog' + where +
      'and open_id in (select distinct open_id from stayMsgLog))) a left join wxuser b on a.source_open_id = b.open_id where b.open_id is not null',
    {
      replacements: [jobId, belongCompany, companyId, openID.openId, sevenDaysAgo, jobId, belongCompany, companyId, openID.openId],
      type: QueryTypes.SELECT
    })
    const data = {
      total: total[0].total
    }
    const openIDRes = await sequelize.query(`select b.*
                                             from (select source_open_id
                                                   from pvLog` + whereWithDate +
      'group by source_open_id having count(*) > 2 union (select source_open_id from pvLog' + where +
      'and open_id in (select distinct open_id from stayMsgLog))) a left join wxuser b on a.source_open_id = b.open_id where b.open_id is not null limit ? offset ?',
    {
      replacements: [jobId, belongCompany, companyId, openID.openId, sevenDaysAgo, jobId, belongCompany, companyId, openID.openId, limit, offset],
      type: QueryTypes.SELECT
    })
    const openIDs = []
    for (const v of openIDRes) {
      openIDs.push(v.open_id)
    }
    const result = await wxuser.findAll({
      where: {
        open_id: {
          [Op.in]: openIDs
        }
      },
      include: [{
        attributes: ['openId', 'updatedAt', 'activeId'],
        model: pvLog,
        limit: 1,
        where: {
          belongCompany: session_user.belongCompany
        },
        order: [['updatedAt', 'DESC']],
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
    data.users = result
    return {
      code: 0,
      message: 'success',
      data: data
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

const sequelize = require('~/libs/db')
const { QueryTypes } = require('sequelize')
const { wxuser } = require('~/models')
const { Op } = require('sequelize')

module.exports = {
  async visitor (ctx) {
    const { session_user } = ctx
    const where = {
      sourceJobId: session_user.jobId,
      belongCompany: session_user.belongCompany
    }
    const total = await wxuser.count({
      where
    })
    const yesterday = await wxuser.count({
      where: {
        ...where,
        createdAt: {
          [Op.gte]: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
        }
      }
    })
    const today = await wxuser.count({
      where: {
        ...where,
        createdAt: {
          [Op.gte]: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
        }
      }
    })
    return {
      code: 0,
      message: 'success',
      data: {
        total,
        yesterday: (yesterday - today),
        today
      }
    }
  },

  async rank (ctx) {
    const { session_user } = ctx
    const jobId = session_user.jobId
    const belongCompany = session_user.belongCompany
    const companyId = session_user.companyId + '%'
    const today = new Date().toISOString().slice(0, 10)
    // mysql8.0支持窗口函数RANK()
    const result = await sequelize.query(`select rankUV
                                          from (select job_id,
                                                       rank() over (order by count(distinct open_id) desc) as rankUV
                                                from pvLog
                                                where belong_company = ?
                                                  and company_id like ?
                                                  and date (updated_at) = ?
                                          group by job_id) a
                                          where job_id = ?`,
    {
      replacements: [belongCompany, companyId, today, jobId],
      type: QueryTypes.SELECT
    })
    const data = { rank: result.length === 0 ? 0 : result[0].rankUV }
    return {
      code: 0,
      message: 'success',
      data: data
    }
  }
}

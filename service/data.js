const { pvLog, user } = require('~/models')
const { Op } = require('sequelize')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)

module.exports = {
  async activeData (data, ctx) {
    try {
      const { type } = data
      delete data.type
      const { session_user } = ctx
      data.belongCompany = session_user.belongCompany
      const dataList = await pvLog.count({
        attributes: ['company_id', 'open_id', 'job_id', 'name', 'company'],
        group: ['company_id', 'open_id', 'job_id', 'name', 'company'],
        distinct: true,
        where: {
          ...data,
          belongCompany: session_user.belongCompany,
          companyId: {
            [Op.like]: `${ctx.session_user.companyId}%`
          }
        }
      })
      const companyData = {}
      const list = []
      let pv = 0
      dataList.forEach((item) => {
        pv += item.count
        if (type === 1) {
          if (companyData[item.company_id] && companyData[item.company_id].pv) {
            companyData[item.company_id].pv += item.count
            companyData[item.company_id].uv += 1
            companyData[item.company_id].openId.push(item.open_id)
          } else {
            companyData[item.company_id] = {}
            companyData[item.company_id].company = item.company
            companyData[item.company_id].companyId = item.company_id
            companyData[item.company_id].pv = item.count
            companyData[item.company_id].uv = 1
            companyData[item.company_id].openId = [item.open_id]
          }
        } else if (type === 0) {
          if (companyData[item.job_id]) {
            companyData[item.job_id].pv += item.count
            companyData[item.job_id].uv += 1
            companyData[item.job_id].openId.push(item.open_id)
          } else {
            companyData[item.job_id] = {}
            companyData[item.job_id].jobId = item.job_id
            companyData[item.job_id].staffName = item.name
            companyData[item.job_id].companyId = item.company_id
            companyData[item.job_id].company = item.company
            companyData[item.job_id].pv = item.count
            companyData[item.job_id].uv = 1
            companyData[item.job_id].openId = [item.open_id]
          }
        }
      })
      Object.keys(companyData).forEach(id => {
        list.push(companyData[id])
      })
      return {
        code: 0,
        data: {
          pv,
          uv: dataList.length,
          list
        },
        message: 'success'
      }
    } catch (ex) {
      logger.error(`list|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  }
}

const { pvLog, shareLog, stayMsgLog } = require('~/models')
const { Op } = require('sequelize')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)

function getLogData (flag, key, arr) {
  const dataArr = arr.filter((data) => data[flag] === key)
  const data = {
    pv: 0,
    uv: dataArr.length,
    openIds: []
  }
  dataArr.forEach(share => {
    data.pv += share.count
    data.openIds.push(share.open_id)
  })
  return data
}

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
      const shareList = await shareLog.count({
        attributes: ['company_id', 'job_id', 'open_id'],
        group: ['company_id', 'job_id', 'open_id'],
        distinct: true,
        where: {
          ...data,
          belongCompany: session_user.belongCompany,
          companyId: {
            [Op.like]: `${ctx.session_user.companyId}%`
          }
        }
      })
      const stayMsgList = await stayMsgLog.count({
        attributes: ['company_id', 'job_id', 'open_id'],
        group: ['company_id', 'job_id', 'open_id'],
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
          if (companyData[item.company_id]) {
            companyData[item.company_id].viewData.pv += item.count
            companyData[item.company_id].viewData.uv += 1
            companyData[item.company_id].viewData.openIds.push(item.open_id)
          } else {
            companyData[item.company_id] = {}
            companyData[item.company_id].company = item.company
            companyData[item.company_id].companyId = item.company_id
            companyData[item.company_id].viewData = {
              pv: 1,
              uv: 1,
              openIds: [item.open_id]
            }
            companyData[item.company_id].shareData = getLogData('company_id', item.company_id, shareList)
            companyData[item.company_id].stayMsgData = getLogData('company_id', item.company_id, stayMsgList)
          }
        } else if (type === 0) {
          if (companyData[item.job_id]) {
            companyData[item.job_id].viewData.pv += item.count
            companyData[item.job_id].viewData.uv += 1
            companyData[item.job_id].viewData.openIds.push(item.open_id)
          } else {
            companyData[item.job_id] = {}
            companyData[item.job_id].jobId = item.job_id
            companyData[item.job_id].staffName = item.name
            companyData[item.job_id].companyId = item.company_id
            companyData[item.job_id].company = item.company
            companyData[item.job_id].viewData = {
              pv: 1,
              uv: 1,
              openIds: [item.open_id]
            }
            companyData[item.job_id].shareData = getLogData('job_id', item.job_id, shareList)
            companyData[item.job_id].stayMsgData = getLogData('job_id', item.job_id, stayMsgList)
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

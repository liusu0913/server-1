const { pvLog, user, shareLog, stayMsgLog, wxuser, active } = require('~/models')
const redis = require('~/libs/redis')
const { Op } = require('sequelize')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)
const nodeXlsx = require('node-xlsx')
const moment = require('moment')

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
      for (let i = 0; i < dataList.length; i++) {
        const item = dataList[i]
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
            let satffInfo = await user.findOne({
              where: {
                jobId: item.job_id,
                belongCompany: session_user.belongCompany
              }
            })
            if (!satffInfo) {
              satffInfo = {}
            }
            companyData[item.job_id] = {}
            companyData[item.job_id].jobId = item.job_id
            companyData[item.job_id].staffName = satffInfo.name || '-'
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
      }
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
  },
  async activeDetail (data, ctx) {
    try {
      const { activeId } = data
      const { session_user } = ctx
      const list = []
      const where = {
        activeId,
        belongCompany: session_user.belongCompany,
        companyId: {
          [Op.like]: `${session_user.companyId}%`
        }
      }
      const pvRes = await pvLog.findAll({
        where,
        distinct: true,
        order: [['createdAt', 'ASC']],
        include: [
          {
            attributes: ['name'],
            model: user,
            where: {
              belongCompany: session_user.belongCompany
            },
            as: 'staff'
          },
          {
            attributes: ['name'],
            model: wxuser,
            where: {
              belongCompany: session_user.belongCompany
            },
            as: 'user'
          }, {
            attributes: ['title'],
            model: active,
            where: {
              belongCompany: session_user.belongCompany
            },
            as: 'active'
          }]
      })
      const stayMsgRes = await stayMsgLog.findAll({
        where
      })
      pvRes.forEach(pv => {
        const data = {}
        const index = list.findIndex((i) => i.openId === pv.openId)
        const isHas = index > -1
        if (isHas) {
          list[index].endTime = pv.createdAt
          return
        } else {
          data.openId = pv.openId
          data.activeId = pv.activeId
          data.activeName = pv.active ? pv.active.title || '' : ''
          data.companyId = pv.companyId
          data.companyName = pv.company
          data.jobId = pv.jobId
          data.staffName = pv.staff.name || '-'
          data.nickName = pv.user ? pv.user.name || '' : ''
          data.startTime = pv.createdAt
          data.endTime = pv.createdAt
          const stayMsgArr = stayMsgRes.filter(i => i.openId === pv.openId)
          if (stayMsgArr.length) {
            const stayMsg = stayMsgArr[0]
            data.companyId = stayMsg.companyId
            data.companyName = stayMsg.company
            data.jobId = stayMsg.jobId
            data.staffName = stayMsg.name
            data.phone = stayMsg.phone || ''
            data.name = stayMsg.userName || ''
          } else {
            data.phone = ''
            data.name = ''
          }
        }
        list.push(data)
      })
      await redis.setex(`${session_user.job}_view_${activeId}_data`, JSON.stringify(list), 60 * 60 * 24)
      return {
        code: 0,
        data: {
          list
        },
        message: 'success'
      }
    } catch (ex) {
      logger.error(`list|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async exportXlsx (data, ctx) {
    try {
      const { activeId } = data
      const { session_user } = ctx
      let list = await redis.get(`${session_user.job}_view_${activeId}_data`)
      if (list) {
        list = JSON.parse(list)
      } else {
        const res = this.activeDetail({ activeId }, ctx)
        if (res.code === 0) {
          list = data.list
        } else {
          throw new Error('获取数据元失败，请稍后重试')
        }
      }
      const xlsxData = []
      list.forEach((item) => {
        item.endTime = moment(item.endTime).format('YYYY-MM-DD HH:mm:ss')
        item.startTime = moment(item.startTime).format('YYYY-MM-DD HH:mm:ss')
        xlsxData.push([item.activeId, item.activeName, item.companyId, item.companyName, item.jobId, item.staffName, item.nickName, item.name, item.phone, item.startTime, item.endTime])
      })
      xlsxData.unshift(['活动ID', '活动名称', '机构代码', '机构名称', '代理人工号', '代理人', '客户微信昵称', '客户姓名', '客户电话', '首次进入时间', '最后进入时间'])
      // 转化为二进制的buffer数据流
      const bufferData = nodeXlsx.build([{ data: xlsxData }])
      // 设置
      ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8')
      // bufferData.data =
      return {
        code: 0,
        data: bufferData.toString('base64'),
        message: 'success'
      }
    } catch (ex) {
      logger.error(`list|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  }
}

const { wxuser, user } = require('~/models')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)

module.exports = {
  async create (data) {
    try {
      // 先拿到unionid 去匹配
      const { unionid, belongCompany, openId, sourceOpenId } = data
      const res = await user.findOne({
        where: {
          belongCompany,
          unionid
        }
      })
      if (res) {
        const [count = 0] = await user.update({
          openId
        }, {
          where: {
            belongCompany,
            jobId: res.jobId
          }
        })
        return util.format.sucHandler({ count })
      } else {
        // 判断sourceOpenId是不是内部员工，是的话不需要添加
        if (sourceOpenId) {
          const res = await user.findOne({
            where: {
              belongCompany,
              openId: sourceOpenId
            }
          })
          if (res) {
            delete data.sourceOpenId
          }
        }
        const wxuserInfo = await wxuser.findOne({
          where: {
            openId: data.openId,
            belongCompany: data.belongCompany
          }
        })

        if (wxuserInfo) {
          delete data.activeId
          delete data.sourceJobId
          if (wxuserInfo.sourceOpenId) {
            delete data.sourceOpenId
          }
          await wxuser.update(data, {
            where: {
              openId: data.openId,
              belongCompany: data.belongCompany
            }
          })
          return {
            code: 0,
            data: {
              ...wxuserInfo.dataValues,
              ...data
            },
            message: 'success'
          }
        } else {
          const result = await wxuser.create(data)
          return util.format.sucHandler(result)
        }
      }
    } catch (ex) {
      logger.error(`create|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  }
}

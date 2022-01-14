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
        const result = await wxuser.create(data)
        return util.format.sucHandler(result)
      }
    } catch (ex) {
      logger.error(`create|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  }
}

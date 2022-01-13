const axios = require('axios')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)

module.exports = {
  async getUnionid (data) {
    try {
      const { code } = data
      console.log(code)
      const miniConfig = {
        AppID: 'wxc26091fcd766a086',
        AppSecret: '442a644e3d3497dc6224eeb5d6dfa536'
      }
      const res = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${miniConfig.AppID}&secret=${miniConfig.AppSecret}&js_code=${code}&grant_type=authorization_code`)
      if (res.data.unionid) {
        return {
          code: 0,
          data: res.data,
          message: 'success'
        }
      } else {
        throw new Error(res.data.errmsg)
      }
    } catch (ex) {
      logger.error(`info|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  }
}

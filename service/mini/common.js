const axios = require('axios')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)
const sha1 = require('sha1')
const { parseInt } = require('lodash')

module.exports = {
  async getUnionid (data) {
    try {
      const { code } = data
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
  },
  async getMpOpenId (data) {
    try {
      const { code } = data
      const mpConfig = {
        AppID: 'wxa740aa4cf482d798',
        AppSecret: '78442db1117beb95b0d8166f7a7bceca'
      }
      const res = await axios.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${mpConfig.AppID}&secret=${mpConfig.AppSecret}&code=${code}&grant_type=authorization_code`)
      if (res.data.openid) {
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
  },
  async getMpUserMsg (data) {
    try {
      const { code } = data
      const mpConfig = {
        AppID: 'wxa740aa4cf482d798',
        AppSecret: '78442db1117beb95b0d8166f7a7bceca'
      }
      const res = await axios.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${mpConfig.AppID}&secret=${mpConfig.AppSecret}&code=${code}&grant_type=authorization_code`)
      if (res.data.openid) {
        // 获取用户信息
        const userRes = await axios.get(`https://api.weixin.qq.com/sns/userinfo?access_token=${res.data.access_token}&openid=${res.data.openid}&lang=zh_CN`)

        return {
          code: 0,
          data: userRes.data,
          message: 'success'
        }
      } else {
        throw new Error(res.data.errmsg)
      }
    } catch (ex) {
      logger.error(`info|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async getMpSign (data) {
    const { url } = data
    const mpConfig = {
      AppID: 'wxa740aa4cf482d798',
      AppSecret: '78442db1117beb95b0d8166f7a7bceca'
    }
    const noncestr = 'maikaiying'
    const time = parseInt((new Date().getTime() / 1000))
    try {
      const tokenRes = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${mpConfig.AppID}&secret=${mpConfig.AppSecret}`)
      if (tokenRes.data && tokenRes.data.access_token) {
        const ticketRes = await axios.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${tokenRes.data.access_token}&type=jsapi`)
        if (ticketRes.data && ticketRes.data.ticket) {
          const str = `jsapi_ticket=${ticketRes.data.ticket}&noncestr=${noncestr}&timestamp=${time}&url=${url}`
          return {
            code: 0,
            data: {
              noncestr,
              time,
              sign: sha1(str)
            },
            message: 'success'
          }
        } else {
          throw new Error(ticketRes.data.errmsg)
        }
      } else {
        throw new Error(tokenRes.data.errmsg)
      }
    } catch (ex) {
      logger.error(`info|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  }
}

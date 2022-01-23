const mpAuth = require('~/libs/weixin/auth')
const mpMsg = require('~/libs/weixin/subscribeMsg')
const logger = require('~/util/logger')(__filename)
const templateID = 'M8cwqpOMWyY8iRhmSJHZ_GgaTlfJcXrhSGb73YMxs3U'

module.exports = {
  async sendMsg (body) {
    const openID = body.openID
    const data = {
      first: {
        value: body.title
      },
      keyword1: {
        value: body.keyword1
      },
      keyword2: {
        value: '点击查看内容，让更多的人知道！（名片分享已开启）'
      },
      remark: {
        value: body.remark
      }
    }
    const mp_template_msg = {
      appid: global.config.serviceAccount.appid,
      template_id: templateID,
      url: body.url,
      data: data
    }
    const ACCESS_TOKEN = await mpAuth.getAccessTokenRemote(global.config.mp.appid, global.config.mp.secret)
    logger.info('ACCESS_TOKEN---> ', JSON.stringify(ACCESS_TOKEN))
    const res = await mpMsg.sendMsg(ACCESS_TOKEN.access_token, openID, mp_template_msg)
    logger.info('Template Msg---> ', JSON.stringify(res))
    if (res.errcode === 43004) {
      return {
        code: 43004,
        message: 'require subscribe'
      }
    }
    if (res.errcode !== 0) {
      throw new Error('公众号消息发送失败')
    }
    return {
      code: 0,
      data: {
        count: 1
      },
      message: 'success'
    }
  }
}

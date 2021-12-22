const request = require('~/libs/request')

module.exports = {
  login: async (appid, secret, code) => {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
    return await request({
      url,
      method: 'post'
    }).then().catch(err => console.error(err))
  },

  getAccessToken: async (code, appid, secret) => {
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`
    return await request({
      url,
      method: 'post'
    })
      .then()
      .catch((err) => console.error(err))
  },

  getUserInfo: async (access_token, openid) => {
    const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}`
    return await request({
      url,
      method: 'post'
    })
      .then()
      .catch((err) => console.error(err))
  }
}

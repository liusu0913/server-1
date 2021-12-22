const request = require('~/libs/request')

module.exports = {
  getAccessTokenRemote: async (appid, secret) => {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
    return await request({
      url,
      method: 'get'
    })
  }
}

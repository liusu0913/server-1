const request = require('~/libs/request')
const { appId, appSecretKey } = global.config.captcha

module.exports = {
  async captcha ({ ticket, randstr, userIP }) {
    const url = `https://ssl.captcha.qq.com/ticket/verify?aid=${appId}&AppSecretKey=${appSecretKey}&Ticket=${ticket}&Randstr=${randstr}&UserIP=${userIP}`
    const { response, evil_level, err_msg } = await request(url)
    return {
      code: response === '1' ? 0 : 1,
      data: { evil_level },
      message: err_msg
    }
  }
}

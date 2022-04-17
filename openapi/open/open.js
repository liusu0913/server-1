const request = require('~/libs/request')

const bind = async (access_token, appid, open_appid) => {
  const url = `https://api.weixin.qq.com/cgi-bin/open/bind?access_token=${access_token}`
  return request({
    url,
    method: 'post',
    data: {
      appid,
      open_appid
    }
  })
}

const create = async (access_token, appid) => {
  const url = `https://api.weixin.qq.com/cgi-bin/open/create?access_token=${access_token}`
  return request({
    url,
    method: 'post',
    data: {
      appid
    }
  })
}

const get = async (access_token, appid) => {
  const url = `https://api.weixin.qq.com/cgi-bin/open/get?access_token=${access_token}`
  return request({
    url,
    method: 'post',
    data: {
      appid
    }
  })
}

module.exports = {
  bind,
  create,
  get
}

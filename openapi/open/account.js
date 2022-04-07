const request = require('~/libs/request')

// 代码模板库设置
const getaccountbasicinfo = async (access_token) => {
  const url = `https://api.weixin.qq.com/cgi-bin/account/getaccountbasicinfo?access_token=${access_token}`
  return request({
    url,
    method: 'get'
  })
}

const modify_domain = async (access_token, options) => {
  const url = `https://api.weixin.qq.com/wxa/modify_domain?access_token=${access_token}`
  return request({
    url,
    method: 'post',
    data: options
  })
}

module.exports = {
  getaccountbasicinfo,
  modify_domain
}

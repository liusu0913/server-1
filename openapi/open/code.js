const request = require('~/libs/request')
const axios = require('axios')

const commit = async (access_token, options) => {
  const url = `https://api.weixin.qq.com/wxa/commit?access_token=${access_token}`
  return request({
    url,
    method: 'post',
    data: options
  })
}

const get_page = async (access_token) => {
  const url = `https://api.weixin.qq.com/wxa/get_page?access_token=${access_token}`
  return request({
    url,
    method: 'get'
  })
}

const get_qrcode = async (access_token, page) => {
  const url = `https://api.weixin.qq.com/wxa/get_qrcode?access_token=${access_token}&path=${page}`
  return axios({
    method: 'get',
    url,
    responseType: 'stream'
  })
}

const submit_audit = async (access_token) => {
  const url = `https://api.weixin.qq.com/wxa/submit_audit?access_token=${access_token}`
  return request({
    url,
    method: 'get'
  })
}

module.exports = {
  commit,
  get_page,
  get_qrcode,
  submit_audit
}

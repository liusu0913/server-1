const request = require('~/libs/request')

const getallcategories = async (access_token) => {
  const url = `https://api.weixin.qq.com/cgi-bin/wxopen/getallcategories?access_token=${access_token}`
  return request({
    url,
    method: 'get'
  })
}

const getcategory = async (access_token) => {
  const url = `https://api.weixin.qq.com/cgi-bin/wxopen/getcategory?access_token=${access_token}`
  return request({
    url,
    method: 'get'
  })
}

const get_category = async (access_token) => {
  const url = `https://api.weixin.qq.com/wxa/get_category?access_token=${access_token}`
  return request({
    url,
    method: 'get'
  })
}

module.exports = {
  getallcategories,
  getcategory,
  get_category
}

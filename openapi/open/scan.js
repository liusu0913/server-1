const request = require('~/libs/request')

const getshowwxaitem = async (access_token) => {
  const url = `https://api.weixin.qq.com/wxa/getshowwxaitem?access_token=${access_token}`
  return request({
    url,
    method: 'get'
  })
}

const getwxamplinkforshow = async (access_token) => {
  const url = `https://api.weixin.qq.com/wxa/getwxamplinkforshow?page=0&num=20&access_token=${access_token}`
  return request({
    url,
    method: 'get'
  })
}

const updateshowwxaitem = async (access_token, { wxa_subscribe_biz_flag = 1, appid = '' }) => {
  const url = `https://api.weixin.qq.com/wxa/updateshowwxaitem?access_token=${access_token}`
  return request({
    url,
    method: 'post',
    data: {
      wxa_subscribe_biz_flag,
      appid
    }
  })
}

module.exports = {
  getshowwxaitem,
  getwxamplinkforshow,
  updateshowwxaitem
}

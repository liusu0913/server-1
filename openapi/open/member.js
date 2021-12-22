const request = require('~/libs/request')

const bind_tester = async (access_token, wechatid) => {
  const url = `https://api.weixin.qq.com/wxa/bind_tester?access_token=${access_token}`
  return request({
    url,
    method: 'post',
    data: {
      wechatid
    }
  })
}

const unbind_tester = async (access_token, wechatid, userstr) => {
  const url = `https://api.weixin.qq.com/wxa/unbind_tester?access_token=${access_token}`
  return request({
    url,
    method: 'post',
    data: {
      wechatid,
      userstr
    }
  })
}

const memberauth = async (access_token, action = 'get_experiencer') => {
  const url = `https://api.weixin.qq.com/wxa/memberauth?access_token=${access_token}`
  return request({
    url,
    method: 'post',
    data: {
      action
    }
  })
}

module.exports = {
  bind_tester,
  unbind_tester,
  memberauth
}

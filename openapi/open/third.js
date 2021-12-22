/* eslint-disable camelcase */
const request = require('~/libs/request')
const { component_appid, component_appsecret } = global.config.third

// 获取令牌 7200s
const getApiComponentToken = async (component_verify_ticket) => {
  const url = 'https://api.weixin.qq.com/cgi-bin/component/api_component_token'
  return request({
    url,
    method: 'post',
    data: {
      component_appid,
      component_appsecret,
      component_verify_ticket
    }
  })
}

// 预授权码 600s
const getApiCreatePreauthcode = async (component_access_token) => {
  const url = `https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token=${component_access_token}`
  return request({
    url,
    method: 'post',
    data: {
      component_appid
    }
  })
}

// 使用授权码获取授权信息 7200s
const getApiQueryAuth = async (component_access_token, authorization_code) => {
  const url = `https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=${component_access_token}`
  return request({
    url,
    method: 'post',
    data: {
      component_appid,
      authorization_code
    }
  })
}

// 获取/刷新接口调用令牌 7200s
const getApiAuthorizerToken = async (component_access_token, authorizer_appid, authorizer_refresh_token) => {
  const url = `https://api.weixin.qq.com/cgi-bin/component/api_authorizer_token?component_access_token=${component_access_token}`
  return request({
    url,
    method: 'post',
    data: {
      component_access_token,
      component_appid,
      authorizer_appid,
      authorizer_refresh_token
    }
  })
}

const getApiGetAuthorizerInfo = async (component_access_token, authorizer_appid) => {
  const url = `https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_info?component_access_token=${component_access_token}`
  console.log(url)
  return request({
    url,
    method: 'post',
    data: {
      component_appid,
      authorizer_appid
    }
  })
}

const getApiGetAuthorizerOption = async (component_access_token, authorizer_appid, option_name) => {
  const url = `https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_option?component_access_token=${component_access_token}`
  return request({
    url,
    method: 'post',
    data: {
      component_appid,
      authorizer_appid,
      option_name
    }
  })
}

const setApiSetAuthorizerOption = async (component_access_token, authorizer_appid, option_name, option_value) => {
  const url = `https://api.weixin.qq.com/cgi-bin/component/api_set_authorizer_option?component_access_token=${component_access_token}`
  return request({
    url,
    method: 'post',
    data: {
      component_appid,
      authorizer_appid,
      option_name,
      option_value
    }
  })
}

const getApiGetAuthorizerList = async (component_access_token, offset, count) => {
  const url = `https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_list?component_access_token=${component_access_token}`
  return request({
    url,
    method: 'post',
    data: {
      component_appid,
      offset,
      count
    }
  })
}

module.exports = {
  getApiComponentToken,
  getApiCreatePreauthcode,
  getApiQueryAuth,
  getApiAuthorizerToken,
  getApiGetAuthorizerInfo,
  getApiGetAuthorizerOption,
  setApiSetAuthorizerOption,
  getApiGetAuthorizerList
}

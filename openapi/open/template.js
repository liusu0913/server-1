const request = require('~/libs/request')

// 代码模板库设置
const gettemplatedraftlist = async (access_token) => {
  const url = `https://api.weixin.qq.com/wxa/gettemplatedraftlist?access_token=${access_token}`
  return request({
    url,
    method: 'get'
  })
}

const addtotemplate = async (access_token, draft_id) => {
  const url = `https://api.weixin.qq.com/wxa/addtotemplate?access_token=${access_token}`
  return request({
    url,
    method: 'post',
    data: {
      draft_id
    }
  })
}

const gettemplatelist = async (access_token) => {
  const url = `https://api.weixin.qq.com/wxa/gettemplatelist?access_token=${access_token}`
  return request({
    url,
    method: 'get'
  })
}

const deletetemplate = async (access_token, template_id) => {
  const url = `https://api.weixin.qq.com/wxa/deletetemplate?access_token=${access_token}`
  return request({
    url,
    method: 'post',
    data: {
      template_id
    }
  })
}

module.exports = {
  gettemplatedraftlist,
  addtotemplate,
  gettemplatelist,
  deletetemplate
}

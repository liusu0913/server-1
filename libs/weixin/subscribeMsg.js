const request = require('~/libs/request')

module.exports = {
  addTemplate: async (access_token, tid, kidList) => {
    const url = `https://api.weixin.qq.com/wxaapi/newtmpl/addtemplate?access_token=${access_token}`
    return await request({
      url,
      method: 'post',
      data: {
        tid,
        kidList
      }
    })
  },
  deleteTemplate: async (access_token, priTmplId) => {
    const url = `https://api.weixin.qq.com/wxaapi/newtmpl/deltemplate?access_token=${access_token}`
    return await request({
      url,
      method: 'post',
      data: {
        priTmplId
      }
    })
  },
  getCategory: async (access_token) => {
    const url = `https://api.weixin.qq.com/wxaapi/newtmpl/getcategory?access_token=${access_token}`
    return await request({
      url,
      method: 'get'
    })
  },
  getPubTemplateKeyWordsById: async (access_token, tid) => {
    const url = `https://api.weixin.qq.com/wxaapi/newtmpl/getpubtemplatekeywords?access_token=${access_token}`
    return await request({
      url,
      method: 'get',
      data: {
        tid
      }
    })
  },
  getPubTemplateTitleList: async (access_token, ids, start, limit) => {
    const url = `https://api.weixin.qq.com/wxaapi/newtmpl/getpubtemplatetitles?access_token=${access_token}`
    return await request({
      url,
      method: 'get',
      data: {
        ids,
        start,
        limit
      }
    })
  },
  getTemplateList: async access_token => {
    const url = `https://api.weixin.qq.com/wxaapi/newtmpl/gettemplate?access_token=${access_token}`
    return await request({
      url,
      method: 'get'
    })
  },
  send: async (access_token, touser, template_id, data) => {
    const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${access_token}`
    return await request({
      url,
      method: 'post',
      data: {
        touser,
        template_id,
        data
      }
    })
  },
  sendMsg: async (access_token, touser, template_id, data) => {
    const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`
    return await request({
      url,
      method: 'post',
      data: {
        touser,
        template_id,
        data
      }
    })
  }
}

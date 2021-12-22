const request = require('~/libs/request')
const nodeurl = require('url')

const { pstn } = global.config

async function getVirtualNumber (requestId, src, dst, record, maxAssignTime) {
  const send_url = nodeurl.format({
    host: pstn.domain,
    pathname: pstn.api.getVirtualNumber,
    query: {
      id: pstn.id
    }
  })
  const result = await request({
    url: send_url,
    method: 'post',
    data: {
      appId: pstn.appid,
      requestId,
      src,
      dst,
      record,
      maxAssignTime,
      statusFlag: '0',
      cityId: pstn.cityId || '',
      hangupUrl: pstn.hangupUrl,
      recordUrl: pstn.recordUrl
    }
  })
  return result
}

async function delVirtualNumber (requestId, bindId) {
  const send_url = nodeurl.format({
    host: pstn.domain,
    pathname: pstn.api.delVirtualNumber,
    query: {
      id: pstn.id
    }
  })
  const result = await request({
    url: send_url,
    method: 'post',
    data: {
      appId: pstn.appid,
      requestId,
      bindId
    }
  })
  return result
}

module.exports = {
  getVirtualNumber,
  delVirtualNumber
}

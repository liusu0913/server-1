const _ = require('lodash')
const error = require('debug')('rocket-node-util:router')
const { REPETADD } = require('~/const')

/**
 * 错误结果格式化
 * @param {string,object} message 错误信息
 * @param {number} code 错误码
 */
const errHandler = (message = '', code = 1001) => {
  if (message.message === 'Validation error') {
    return {
      code: REPETADD,
      message: '数据已经存在不要重复添加'
    }
  }
  error(message)
  if (typeof message !== 'string') {
    message = message.message
    code = 1002
  }
  return {
    code,
    message
  }
}
/**
 * 正确结果格式化
 * @param {object} data 正确结果
 * @param {string} type 不同方法返回不同格式，默认为空
 */
const sucHandler = (data = {}, type = '') => {
  if (type === 'list') {
    const { rows, count } = data
    data = {
      list: rows,
      count
    }
  }
  return {
    code: 0,
    data,
    message: 'ok'
  }
}
/**
 * 列表查询格式化
 * @param {object} data 数据库查询参数
 */
const dataProcessor = (data = {}) => {
  const { offset, count, order = [['id', 'DESC']] } = data
  delete data.offset
  delete data.count
  delete data.order
  delete data.login_token
  delete data.session_id
  const where = {}
  Object.keys(data).forEach((key) => {
    const value = _.get(data, key)
    if (!_.isEmpty(value) || _.isNumber(value)) {
      where[key] = value
    }
  })
  // console.log(where)
  return {
    where,
    offset,
    limit: count,
    order
  }
}

module.exports = {
  sucHandler,
  errHandler,
  dataProcessor
}

const { SECRET, VOID_TOKEN, LOGIN_EXPRESS } = require('~/const')
const jwt = require('jsonwebtoken')

module.exports = function (ignoreApi = []) {
  return async (ctx, next) => {
    const data = (ctx.request.body)
    if (ignoreApi.indexOf(ctx.url) !== -1) {
      await next()
      return
    }
    try {
      const res = await jwt.verify(ctx.header.authorization.slice(7), SECRET)
      if (res.role === 0 && data.belongCompany === undefined) {
        ctx.body = {
          code: 1002,
          message: '缺少必要参数：超级管理员创建用户，必须传递belongCompany'
        }
        return
      }
      ctx.session_user = res
      await next()
    } catch (error) {
      console.log(error)
      switch (error.name) {
        case 'TokenExpiredError':
          ctx.body = {
            code: LOGIN_EXPRESS,
            message: '登录失效，请重新登录'
          }
          break
        default:
          ctx.body = {
            code: VOID_TOKEN,
            message: '非法的token'
          }
          break
      }
    }
  }
}

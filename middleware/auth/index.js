const { SECRET, VOID_TOKEN, LOGIN_EXPRESS } = require('~/const')
const jwt = require('jsonwebtoken')

module.exports = function (ignoreApi = []) {
  return async (ctx, next) => {
    if (ignoreApi.indexOf(ctx.url) !== -1) {
      await next()
      return
    }
    try {
      const res = await jwt.verify(ctx.header.authorization.slice(7), SECRET)
      ctx.session_user = res
      await next()
    } catch (error) {
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
            message: '非法的token，请检查token是否携带正确'
          }
          break
      }
    }
  }
}

const debug = require('debug')('rocket-node:auth')
const error = require('debug')('rocket-node-error:auth')
const jwt = require('~/libs/jwt')

const whiteList = [
  '/admin/passport/user/login',
  '/admin/passport/user/captcha'
]

module.exports = function (app, options) {
  return async function rocketAuth (ctx, next) {
    for (const p of whiteList) {
      const rep = new RegExp(p)
      if (rep.test(ctx.url)) {
        return next()
      }
    }
    const token = ctx.cookies.get('token')
    if (token) {
      debug(token)
      const isVerify = jwt.verify(token)
      if (isVerify) {
        debug('login success')
        return next()
      } else {
        error('token is not pass')
        ctx.status = 401
      }
    } else {
      error('token is miss')
      ctx.body = {
        code: 401,
        message: 'token is miss'
      }
      ctx.status = 401
    }
  }
}

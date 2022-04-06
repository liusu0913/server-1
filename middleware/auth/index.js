const { SECRET, VOID_TOKEN, LOGIN_EXPRESS, USERDELETE } = require('~/const')
const jwt = require('jsonwebtoken')
const { user } = require('~/models')

module.exports = function (ignoreApi = []) {
  return async (ctx, next) => {
    const data = (ctx.request.body)
    if (ignoreApi.indexOf(ctx.url) !== -1) {
      await next()
      return
    }
    try {
      const res = await jwt.verify(ctx.header.authorization.slice(7), SECRET)
      const userInfo = await user.findOne({
        where: {
          jobId: res.jobId,
          belongCompany: res.belongCompany
        }
      })
      if (!userInfo || !Number(userInfo.status)) {
        ctx.body = {
          code: USERDELETE,
          message: '该用户已经被封禁或者删除，请联系公司管理员'
        }
        return
      }

      const superAdminIgnoreApi = [
        '/api/admin/company/info',
        '/api/admin/user/info',
        '/api/admin/company/create',
        '/api/admin/company/delete'
      ]
      if (superAdminIgnoreApi.indexOf(ctx.url) === -1) {
        if (res.role === 0) {
          if (data.belongCompany) {
            res.belongCompany = data.belongCompany
          } else {
            ctx.body = {
              code: 1002,
              message: '缺少必要参数：超级管理员创建用户，必须传递belongCompany'
            }
            return
          }
        }
      }
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
            message: '非法的token'
          }
          break
      }
    }
  }
}

const userService = require('~/service/admin/user')
const { SECRET, NO_REGISTER, LOGIN_PASSWORD_ERROR } = require('~/const')
const jwt = require('jsonwebtoken')

module.exports = {
  async login (body) {
    const res = await userService.info({
      jobId: body.account
    })
    const { code, data } = res
    console.log(NO_REGISTER)
    if (code) {
      return {
        code: NO_REGISTER,
        message: '该工号未注册'
      }
    }
    // 工号已经注册，需要验证密码就是手机号是不是正确
    const { phone } = data
    if (phone !== body.password) {
      // 中token
      return {
        code: LOGIN_PASSWORD_ERROR,
        message: '密码错误'
      }
    }
    const token = await jwt.sign({
      jobId: data.jobId,
      name: data.name,
      phone: data.phone,
      companyId: data.companyId,
      role: data.role
    }, SECRET, {
      expiresIn: '7d'
      // expiresIn: 1
    })
    return {
      code: 0,
      data: {
        token: token
      },
      message: 'success'
    }
  }
}

const util = require('~/util')
const { user } = require('~/models')

const { SECRET, NO_REGISTER, LOGIN_PASSWORD_ERROR } = require('~/const')
const jwt = require('jsonwebtoken')

module.exports = {
  async login (body) {
    let resID, resP
    const resultID = await user.findOne({
      where: {
        jobId: body.account
      }
    })
    const resultP = await user.findOne({
      where: {
        jobId: body.account,
        phone: body.password
      }
    })
    if (resultID) {
      resID = util.format.sucHandler(resultID)
    } else {
      resID = util.format.errHandler('没有找到任何符合条件的记录!')
    }

    if (resultP) {
      resP = util.format.sucHandler(resultP)
    } else {
      resP = util.format.errHandler('没有找到任何符合条件的记录!')
    }
    if (resID.code !== 0) {
      return {
        code: NO_REGISTER,
        message: '该工号未注册'
      }
    }
    if (resID.code === 0 && resP.code !== 0) {
      return {
        code: LOGIN_PASSWORD_ERROR,
        message: '密码错误'
      }
    }
    const { data } = resP
    const token = await jwt.sign({
      jobId: data.jobId,
      name: data.name,
      phone: data.phone,
      companyId: data.companyId,
      role: data.role,
      belongCompany: data.belongCompany
    }, SECRET, {
      expiresIn: '7d'
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

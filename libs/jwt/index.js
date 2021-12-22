/* eslint-disable promise/param-names */
const jwt = require('jsonwebtoken')
const { secret, expiresIn } = global.config.jwt

const verify = (token) => {
  return new Promise((reslove, reject) => {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        reject(error.message)
        return
      }
      reslove(decoded)
    })
  })
}

module.exports = {
  sign (payload, options) {
    const token = jwt.sign(payload, secret, {
      expiresIn,
      ...options
    })
    return token
  },
  async verify (token) {
    try {
      return await verify(token)
    } catch (ex) {
      console.error(ex)
      return false
    }
  }
}

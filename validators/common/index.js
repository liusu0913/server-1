
module.exports = {
  login: {
    required: ['account', 'password'],
    properties: {
      account: {
        type: 'string'
      },
      password: {
        type: 'string'
      }
    }
  }
}

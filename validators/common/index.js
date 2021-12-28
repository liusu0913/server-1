
module.exports = {
  login: {
    required: ['account', 'password']
  },
  getCosConfig: {
    required: ['bucket', 'region']
  },
  schema: {
    type: 'object',
    properties: {
      account: {
        type: 'string'
      },
      password: {
        type: 'string'
      },
      bucket: {
        type: 'string',
        maxLength: 255
      },
      region: {
        type: 'string',
        maxLength: 255
      }
    }
  }
}

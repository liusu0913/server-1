module.exports = {
  info: {
    required: ['openId']
  },
  schema: {
    type: 'object',
    properties: {
      openId: {
        type: 'string',
        maxLength: 255
      },
      name: {
        type: 'string',
        maxLength: 255
      },
      avatar: {
        type: 'string',
        maxLength: 255
      },
      sourceJobId: {
        type: 'string',
        maxLength: 255
      },
      belongCompany: {
        type: 'integer'
      }
    }
  }
}

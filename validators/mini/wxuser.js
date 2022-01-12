module.exports = {
  visitHistroy: {
    required: ['openId', 'offset', 'count']
  },
  info: {
    required: ['openId']
  },
  schema: {
    type: 'object',
    properties: {
      offset: {
        type: 'integer'
      },
      count: {
        type: 'integer'
      },
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

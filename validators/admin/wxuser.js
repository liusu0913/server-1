module.exports = {
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: [
      'activeId',
      'openId',
      'name',
      'avatar',
      'sourceJobId',
      'belongCompany'
    ]
  },
  update: {
    required: ['openId']
  },
  delete: {
    required: ['openId']
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
      id: {
        type: 'integer'
      },
      activeId: {
        type: 'string',
        maxLength: 255
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

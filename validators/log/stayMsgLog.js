module.exports = {
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: [
      'activeId',
      'openId',
      'phone',
      'jobId',
      'belongCompany'
    ]
  },
  update: {
    required: ['id']
  },
  delete: {
    required: ['id']
  },
  info: {
    required: ['id']
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
      phone: {
        type: 'string',
        maxLength: 255
      },
      jobId: {
        type: 'string',
        maxLength: 255
      },
      name: {
        type: 'string',
        maxLength: 255
      },
      cpmpanyId: {
        type: 'string',
        maxLength: 255
      },
      company: {
        type: 'string',
        maxLength: 255
      },
      belongCompany: {
        type: 'integer'
      },
      content: {
        type: 'string',
        maxLength: 255
      }
    }
  }
}

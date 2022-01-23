module.exports = {
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: [
      'activeId',
      'openId',
      'jobId',
      'result',
      'belongCompany'
    ]
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
      jobId: {
        type: 'string',
        maxLength: 255
      },
      name: {
        type: 'string',
        maxLength: 255
      },
      companyId: {
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
      result: {
        type: 'string',
        maxLength: 255
      }
    }
  }
}

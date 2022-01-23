module.exports = {
  activeDetail: {
    required: [
      'activeId'
    ]
  },
  activeData: {
    required: [
      'activeId',
      'type'
    ]
  },
  schema: {
    type: 'object',
    properties: {
      type: {
        type: 'integer'
      },
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
      companyId: {
        type: 'string',
        maxLength: 255
      },
      belongCompany: {
        type: 'integer'
      }
    }
  }
}

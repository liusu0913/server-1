module.exports = {
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: ['activeId', 'jobId', 'type']
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
      jobId: {
        type: 'string',
        maxLength: 255
      },
      type: {
        type: 'integer'
      },
      belongCompany: {
        type: 'integer'
      }
    }
  }
}

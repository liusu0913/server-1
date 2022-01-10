module.exports = {
  list: {
    required: ['offset', 'count', 'type']
  },
  create: {
    required: ['activeId', 'jobIds', 'type']
  },
  schema: {
    type: 'object',
    properties: {
      jobIds: {
        type: 'array'
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

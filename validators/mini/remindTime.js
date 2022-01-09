module.exports = {
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: ['type']
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

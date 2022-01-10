module.exports = {
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: ['fodderId', 'tagIds']
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
      tagIds: {
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
      fodderId: {
        type: 'string',
        maxLength: 255
      },
      belongCompany: {
        type: 'integer'
      }
    }
  }
}

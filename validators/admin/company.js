module.exports = {
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: ['companyName']
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
      companyName: {
        type: 'string',
        maxLength: 255
      },
      updatedAt: {
        type: 'string'
      }
    }
  }
}

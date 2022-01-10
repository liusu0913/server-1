module.exports = {
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: ['title']
  },
  delete: {
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
      belongCompany: {
        type: 'integer'
      },
      title: {
        type: 'string',
        maxLength: 255
      }
    }
  }
}

module.exports = {
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: ['title']
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

module.exports = {
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: ['title', 'content']
  },
  update: {
    required: ['fodderId']
  },
  delete: {
    required: ['fodderId']
  },
  info: {
    required: ['fodderId']
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
      fodderId: {
        type: 'string',
        maxLength: 255
      },
      title: {
        type: 'string',
        maxLength: 255
      },
      content: {
        type: 'string',
        maxLength: 255
      },
      belongCompany: {
        type: 'integer'
      }
    }
  }
}

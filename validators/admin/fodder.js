module.exports = {
  batchDelete: {
    required: ['fodderIds']
  },
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: ['title', 'content', 'type']
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
      fodderIds: {
        type: 'array'
      },
      type: {
        type: 'integer'
      },
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

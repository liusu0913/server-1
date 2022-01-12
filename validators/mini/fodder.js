module.exports = {
  list: {
    required: ['offset', 'count', 'type']
  },
  info: {
    required: ['fodderId']
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

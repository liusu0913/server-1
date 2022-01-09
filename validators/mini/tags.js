module.exports = {
  list: {
    required: ['offset', 'count', 'fatherId']
  },
  schema: {
    type: 'object',
    properties: {
      fatherId: {
        type: 'integer'
      },
      belongCompany: {
        type: 'integer'
      },
      updatedAt: {
        type: 'string'
      },
      createdAt: {
        type: 'string'
      }
    }
  }
}

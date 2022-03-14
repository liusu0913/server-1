module.exports = {
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: ['name', 'fatherId']
  },
  update: {
    required: ['name', 'id']
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
      name: {
        type: 'string',
        maxLength: 255
      },
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

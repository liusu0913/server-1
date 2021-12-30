module.exports = {
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: ['activeId', 'tagId', 'belongCompany']
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
      activeId: {
        type: 'string',
        maxLength: 255
      },
      tagId: {
        type: 'integer'
      },
      createdAt: {
        type: 'string'
      },
      updatedAt: {
        type: 'string'
      },
      belongCompany: {
        type: 'integer'
      }
    }
  }
}

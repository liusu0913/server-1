module.exports = {
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: ['activeId', 'tagIds']
  },
  delete: {
    required: ['activeId']
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

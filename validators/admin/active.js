module.exports = {
  batchDelete: {
    required: ['activeIds']
  },
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: [
      'title',
      'url',
      'diffuseTypeId',
      'startTime'
    ]
  },
  update: {
    required: ['activeId']
  },
  delete: {
    required: ['activeId']
  },
  info: {
    required: ['activeId']
  },
  schema: {
    type: 'object',
    properties: {
      activeIds: {
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
      title: {
        type: 'string',
        maxLength: 255
      },
      url: {
        type: 'string',
        maxLength: 255
      },
      typeId: {
        type: 'integer'
      },
      diffuseTypeId: {
        type: 'integer'
      },
      startTime: {
        type: 'string'
      },
      belongCompany: {
        type: 'integer'
      },
      createdAt: {
        type: 'string'
      },
      updatedAt: {
        type: 'string'
      }
    }
  }
}

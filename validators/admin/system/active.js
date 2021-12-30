module.exports = {
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: [
      'activeId',
      'title',
      'url',
      'typeId',
      'diffuseTypeId',
      'startTime',
      'belongCompany'
    ]
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

module.exports = {
  wxuser: {
    required: []
  },
  activeDetails: {
    required: ['day']
  },
  rank: {
    required: ['day']
  },
  schema: {
    type: 'object',
    properties: {
      day: {
        type: 'integer'
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

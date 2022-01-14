
module.exports = {
  update: {
    required: []
  },
  active: {
    require: ['jobId', 'status']
  },
  info: {
    required: []
  },
  schema: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['0', '1']
      },
      file: {
        type: 'object'
      },
      type: {
        type: 'number',
        enum: [0, 1]
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
      jobId: {
        type: 'string',
        maxLength: 255
      },
      name: {
        type: 'string',
        maxLength: 255
      },
      title: {
        type: 'string',
        maxLength: 255
      },
      phone: {
        type: 'string',
        maxLength: 255
      },
      company: {
        type: 'string',
        maxLength: 255
      },
      companyId: {
        type: 'string',
        maxLength: 255
      },
      role: {
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

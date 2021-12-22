
module.exports = {
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: ['jobId', 'name', 'title', 'companyId', 'company']
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
  // 批量操作的type：1覆盖； 0跳过
  batchAdd: {
    required: ['file', 'type'],
    properties: {
      file: {
        type: 'object'
      },
      type: {
        type: 'number',
        enum: [0, 1]
      }
    }
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
      companyId: {
        type: 'string',
        maxLength: 255
      },
      company: {
        type: 'string',
        maxLength: 255
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

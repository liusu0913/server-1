
module.exports = {
  list: {
    required: ['offset', 'count']
  },
  create: {
    required: [
      'jobId',
      'name',
      'title',
      'phone',
      'role',
      'companyId',
      'company'
    ]
  },
  update: {
    required: ['jobId']
  },
  active: {
    require: ['jobId', 'status'],
    properties: {
      status: {
        type: 'string',
        enum: ['0', '1']
      }
    }
  },
  delete: {
    required: ['jobId']
  },
  info: {
    required: ['jobId']
  },
  // 批量操作的type：1覆盖； 0跳过
  batchAdd: {
    required: ['file', 'type', 'role'],
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
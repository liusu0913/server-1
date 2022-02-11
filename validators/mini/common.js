module.exports = {
  getUnionid: {
    required: ['code']
  },
  getMpOpenId: {
    required: ['code']
  },
  getMpSign: {
    required: ['url']
  },
  schema: {
    type: 'object',
    properties: {
      url: {
        type: 'string'
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

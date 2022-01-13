module.exports = {
  getUnionid: {
    required: ['code']
  },
  schema: {
    type: 'object',
    properties: {
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

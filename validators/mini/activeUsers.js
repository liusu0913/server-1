module.exports = {
  recommend: {
    properties: {
      limit: {
        type: 'integer',
      },
      count: {
        type: 'integer',
      }
    },
  },

  tags: {
    required: ['openId'],
  },
}

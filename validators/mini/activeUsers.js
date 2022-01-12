module.exports = {
  recommend: {
    properties: {
      limit: {
        type: 'integer',
      },
      offset: {
        type: 'integer',
      }
    },
  },

  tags: {
    required: ['openId'],
  },
}

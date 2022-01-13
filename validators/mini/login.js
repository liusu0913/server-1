module.exports = {
  sendSms: {
    required: ['jobId', 'phone'],
    properties: {
      phone: {
        type: 'string',
        pattern: '^1[3-9]\\d{9}$',
      },
    },
  },
  login: {
    required: ['jobId', 'phone', 'code'],
    properties: {
      phone: {
        type: 'string',
        pattern: '^1[3-9]\\d{9}$',
      },
    },
  },
  updateOpenID: {
    required: ['jobId', 'phone', 'code'],
  },
}

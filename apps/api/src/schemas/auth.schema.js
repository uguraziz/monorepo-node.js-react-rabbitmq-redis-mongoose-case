export const authSchemas = {
  requestOTP: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
    },
  },
  verifyOTP: {
    type: 'object',
    required: ['email', 'otp'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
      otp: {
        type: 'string',
        pattern: '^[0-9]{6}$',
      },
    },
  },
};


export const requestOTPSchema = {
  type: 'object',
  required: ['email'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
  },
};

export const verifyOTPSchema = {
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
};

export const refreshTokenSchema = {
  type: 'object',
  required: ['refreshToken'],
  properties: {
    refreshToken: {
      type: 'string',
    },
  },
};

export const logoutSchema = {
  type: 'object',
  required: ['refreshToken'],
  properties: {
    refreshToken: {
      type: 'string',
    },
  },
};


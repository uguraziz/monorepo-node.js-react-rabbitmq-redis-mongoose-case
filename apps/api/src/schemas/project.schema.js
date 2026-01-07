export const projectSchemas = {
  create: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
      },
      description: {
        type: 'string',
        maxLength: 500,
      },
    },
  },
  update: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
      },
      description: {
        type: 'string',
        maxLength: 500,
      },
    },
  },
};


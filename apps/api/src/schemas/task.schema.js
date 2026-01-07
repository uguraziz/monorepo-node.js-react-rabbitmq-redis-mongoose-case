export const taskSchemas = {
  create: {
    type: 'object',
    required: ['title', 'projectId'],
    properties: {
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 200,
      },
      description: {
        type: 'string',
        maxLength: 1000,
      },
      status: {
        type: 'string',
        enum: ['todo', 'in-progress', 'done'],
      },
      projectId: {
        type: 'string',
      },
      assigneeId: {
        type: 'string',
      },
      tags: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  },
  update: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 200,
      },
      description: {
        type: 'string',
        maxLength: 1000,
      },
      status: {
        type: 'string',
        enum: ['todo', 'in-progress', 'done'],
      },
      assigneeId: {
        type: 'string',
      },
      tags: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  },
};


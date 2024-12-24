const { linterForAepRule } = require('../utils');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0131', 'aep-131-response-schema');
  return linter;
});

test('aep-131-response-schema should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        get: {
          responses: {
            200: {
              description: 'success',
              content: {
                'application/json': {
                  // no x-aep-extension
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
      '/test2/{id}': {
        get: {
          responses: {
            200: {
              description: 'success',
              content: {
                'application/json': {
                  // no x-aep-extension
                  schema: {
                    $ref: '#/components/schemas/Test2',
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Test2: {
          type: 'object',
          // no x-aep-extension
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    const paths = results.map(({ path }) => path.join('.'));
    expect(paths).toContain('paths./test1/{id}.get.responses.200.content.application/json.schema');
    expect(paths).toContain('paths./test2/{id}.get.responses.200.content.application/json.schema');
  });
});

test('aep-131-response-schema should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        get: {
          responses: {
            200: {
              description: 'success',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    'x-aep-resource': {
                      singular: 'User',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/test2/{id}': {
        get: {
          responses: {
            200: {
              description: 'success',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Test2',
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Test2: {
          type: 'object',
          'x-aep-resource': {
            singular: 'Test2',
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

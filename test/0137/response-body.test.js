const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0137', 'aep-137-response-body');
  return linter;
});

test('aep-137-response-body should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        put: {
          description: 'No responses',
          operationId: 'ApplyTest1',
        },
      },
      '/test2/{id}': {
        put: {
          description: 'No content in 200 response',
          responses: {
            200: {
              description: 'OK',
            },
          },
        },
      },
      '/test3/{id}': {
        put: {
          description: 'Response body without schema',
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  description: 'No schema',
                },
              },
            },
          },
        },
      },
      '/test4/{id}': {
        put: {
          description: 'Response body schema without x-aep-resource extension',
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
      '/test5/{id}': {
        put: {
          description: 'Response body is $ref to schema without x-aep-resource extension',
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Test5',
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
        Test5: {
          description: 'Schema without x-aep-resource extension',
          type: 'object',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(5);
    expect(results).toContainMatch({
      path: ['paths', '/test1/{id}', 'put'],
      message: 'The response body is not an AEP resource.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2/{id}', 'put', 'responses', '200'],
      message: 'The response body is not an AEP resource.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test3/{id}', 'put', 'responses', '200', 'content', 'application/json'],
      message: 'The response body is not an AEP resource.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test4/{id}', 'put', 'responses', '200', 'content', 'application/json', 'schema'],
      message: 'The response body is not an AEP resource.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test5/{id}', 'put', 'responses', '200', 'content', 'application/json', 'schema'],
      message: 'The response body is not an AEP resource.',
    });
  });
});

test('aep-137-response-body should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        put: {
          description: '200 response body with resource schema',
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    'x-aep-resource': true,
                  },
                },
              },
            },
          },
        },
      },
      '/test2/{id}': {
        put: {
          description: 'Response body is $ref to schema with x-aep-resource extension',
          responses: {
            200: {
              description: 'OK',
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
      '/test3/{id}': {
        put: {
          description: 'responses other than 200',
          responses: {
            202: {
              description: 'Accepted',
            },
            400: {
              description: 'Bad Request',
            },
            500: {
              description: 'Internal Server Error',
            },
          },
        },
      },
      '/test4/{id}': {
        description: 'responses for other methods',
        get: {
          responses: {
            200: {
              description: 'OK',
            },
          },
        },
        post: {
          responses: {
            200: {
              description: 'OK',
            },
          },
        },
        patch: {
          responses: {
            200: {
              description: 'OK',
            },
          },
        },
        delete: {
          responses: {
            200: {
              description: 'OK',
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Test2: {
          description: 'Schema with x-aep-resource extension',
          type: 'object',
          'x-aep-resource': { singular: 'Test2', plural: 'Test2s' },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    if (results.length > 0) {
      console.warn(results);
    }
    expect(results.length).toBe(0);
  });
});

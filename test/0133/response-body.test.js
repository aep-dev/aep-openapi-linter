const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0133', 'aep-133-response-body');
  return linter;
});

test('aep-133-response-body should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        post: {
          description: 'No responses',
          operationId: 'createTest1',
        },
      },
      '/test2': {
        post: {
          description: 'No 200 or 201 response',
          responses: {
            204: {
              description: 'OK',
            },
          },
        },
      },
      '/test3': {
        post: {
          description: 'No content in 200/201 response',
          responses: {
            201: {
              description: 'OK',
            },
          },
        },
      },
      '/test4': {
        post: {
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
      '/test5': {
        post: {
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
      '/test6': {
        post: {
          description: 'Response body is $ref to schema without x-aep-resource extension',
          responses: {
            201: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Test6',
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
        Test6: {
          description: 'Schema without x-aep-resource extension',
          type: 'object',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(6);
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'post'],
      message: 'The response body is not an AEP resource.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2', 'post', 'responses'],
      message: 'The response body is not an AEP resource.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test3', 'post', 'responses', '201'],
      message: 'The response body is not an AEP resource.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test4', 'post', 'responses', '200', 'content', 'application/json'],
      message: 'The response body is not an AEP resource.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test5', 'post', 'responses', '200', 'content', 'application/json', 'schema'],
      message: 'The response body is not an AEP resource.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test6', 'post', 'responses', '201', 'content', 'application/json', 'schema'],
      message: 'The response body is not an AEP resource.',
    });
  });
});

test('aep-133-response-body should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        post: {
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
      '/test2': {
        post: {
          description: '201 response body with resource schema',
          responses: {
            201: {
              description: 'Created',
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
      '/test3': {
        post: {
          description: '200 and 201 response body with resource schema',
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
            201: {
              description: 'Created',
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
      '/test4': {
        description: 'responses other than 200/201',
        post: {
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
      '/test5': {
        description: 'responses for other methods',
        get: {
          responses: {
            200: {
              description: 'OK',
            },
          },
        },
        put: {
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
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

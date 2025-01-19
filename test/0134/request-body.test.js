const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0134', 'aep-134-request-body');
  return linter;
});

test('aep-134-request-body should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        patch: {
          description: 'No request body',
          responses: {
            200: {
              description: 'OK',
            },
          },
        },
      },
      '/test2/{id}': {
        patch: {
          description: 'Request body that does not have content',
          requestBody: {
            description: 'No content',
          },
          responses: {
            200: {
              description: 'OK',
            },
          },
        },
      },
      '/test3/{id}': {
        patch: {
          description: 'Request body without x-aep-resource extension',
          requestBody: {
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
      '/test4/{id}': {
        patch: {
          description: 'Request body is $ref to schema without x-aep-resource extension',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Test3',
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Test3: {
          description: 'Schema without x-aep-resource extension',
          type: 'object',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(4);
    expect(results).toContainMatch({
      path: ['paths', '/test1/{id}', 'patch'],
      message: 'The request body is not an AEP resource.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2/{id}', 'patch', 'requestBody'],
      message: 'The request body is not an AEP resource.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test3/{id}', 'patch', 'requestBody', 'content', 'application/json', 'schema'],
      message: 'The request body is not an AEP resource.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test4/{id}', 'patch', 'requestBody', 'content', 'application/json', 'schema'],
      message: 'The request body is not an AEP resource.',
    });
  });
});

test('aep-134-request-body should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        patch: {
          requestBody: {
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
      '/test2/{id}': {
        description: 'Methods other than POST are not checked',
        get: {
          responses: {
            200: {
              description: 'OK',
            },
          },
        },
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
        put: {
          requestBody: {
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
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0158', 'aep-158-response-next-page-token-property');
  return linter;
});

test('aep-158-response-next-page-token-property should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          description: 'response does not have properties',
          responses: {
            200: {
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
      '/test2': {
        get: {
          description: 'response does not have next_page_token property',
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      results: {
                        type: 'array',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/test3': {
        get: {
          description: 'next_page_token in response is not type: string',
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      results: {
                        type: 'array',
                      },
                      next_page_token: {
                        type: 'integer',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    const message = 'The response schema must include a string next_page_token property.';
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'get', 'responses', '200', 'content', 'application/json', 'schema'],
      message,
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2', 'get', 'responses', '200', 'content', 'application/json', 'schema', 'properties'],
      message,
    });
    expect(results).toContainMatch({
      path: [
        'paths',
        '/test3',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'next_page_token',
        'type',
      ],
      message,
    });
  });
});

test('aep-158-response-next-page-token-property should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          parameters: [
            {
              name: 'max_page_size',
              in: 'query',
              schema: {
                type: 'integer',
              },
            },
          ],
        },
      },
      '/test2': {
        post: {
          description: 'max_page_size is not required for post',
        },
        put: {
          description: 'max_page_size is not required for put',
        },
        patch: {
          description: 'max_page_size is not required for patch',
        },
        delete: {
          description: 'max_page_size is not required for delete',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('aep-158-response-next-page-token-property should not find errors for operation on singleton resource', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          operationId: 'getTest',
          responses: {
            200: {
              description: 'Ok',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                      },
                    },
                    'x-aep-resource': {
                      singleton: true,
                    },
                  },
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

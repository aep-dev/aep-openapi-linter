const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0158', 'aep-158-response-array-property');
  return linter;
});

test('aep-158-response-array-property should find errors', () => {
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
          description: 'response does not have an array property',
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      results: {
                        type: 'string',
                      },
                      next_page_token: {
                        type: 'string',
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
    expect(results.length).toBe(2);
    const message = 'The response schema must include an array property.';
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'get', 'responses', '200', 'content', 'application/json', 'schema'],
      message,
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2', 'get', 'responses', '200', 'content', 'application/json', 'schema', 'properties'],
      message,
    });
  });
});

test('aep-158-response-array-property should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          description: 'response does not have an array property',
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
                        type: 'string',
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
    expect(results.length).toBe(0);
  });
});

test('aep-158-response-array-property should not find errors for operation on singleton resource', () => {
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

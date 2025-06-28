const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0151', 'aep-151-operation-schema');
  return linter;
});

test('aep-151-operation-schema should find errors when required properties are missing', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        post: {
          responses: {
            202: {
              description: 'Accepted',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      path: {
                        type: 'string',
                      },
                      done: {
                        type: 'boolean',
                      },
                      // missing error and response properties
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
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      path: ['paths', '/test', 'post', 'responses', '202', 'content', 'application/json', 'schema', 'properties'],
      message: '202 response must define an application/json response body with Operation schema',
    });
  });
});

test('aep-151-operation-schema should find no errors with valid Operation schema', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        post: {
          responses: {
            202: {
              description: 'Accepted',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      path: {
                        type: 'string',
                      },
                      done: {
                        type: 'boolean',
                      },
                      error: {
                        type: 'object',
                      },
                      response: {
                        type: 'object',
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

test('aep-151-operation-schema should find no errors when no 202 response is present', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        post: {
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

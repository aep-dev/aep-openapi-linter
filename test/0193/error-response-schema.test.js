const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0193', 'aep-193-error-response-schema');
  return linter;
});

test('aep-193-error-response-schema should find warnings', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        get: {
          description: 'error response does not have type property',
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
            404: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: {
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
      '/test2/{id}': {
        get: {
          description: 'detail in response is not type: string',
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
            404: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'integer',
                      },
                      type: {
                        type: 'string',
                        format: 'uri-reference',
                      },
                      detail: {
                        type: 'integer',
                      },
                      instance: {
                        type: 'string',
                        format: 'uri-reference',
                      },
                      title: {
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
      '/test3/{id}': {
        get: {
          description: 'type property does not have format: uri-reference',
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
            404: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      type: {
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
    expect(results.length).toBe(3);
    expect(results).toContainMatch({
      path: ['paths', '/test1/{id}', 'get', 'responses', '404', 'content', 'application/json', 'schema', 'properties'],
      message: '"properties" property must have required property "type"',
    });
    expect(results).toContainMatch({
      path: [
        'paths',
        '/test2/{id}',
        'get',
        'responses',
        '404',
        'content',
        'application/json',
        'schema',
        'properties',
        'detail',
        'type',
      ],
      message: '"type" property must be equal to one of the allowed values: "string". Did you mean "string"?',
    });
    expect(results).toContainMatch({
      path: [
        'paths',
        '/test3/{id}',
        'get',
        'responses',
        '404',
        'content',
        'application/json',
        'schema',
        'properties',
        'type',
      ],
      message: '"type" property must have required property "format"',
    });
  });
});

test('aep-193-error-response-schema should find no warnings', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      response: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
            404: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'integer',
                      },
                      type: {
                        type: 'string',
                        format: 'uri-reference',
                      },
                      detail: {
                        type: 'string',
                      },
                      instance: {
                        type: 'string',
                        format: 'uri-reference',
                      },
                      title: {
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
      '/test2/{id}': {
        delete: {
          description: 'Schema is checked only for error responses 4xx and 5xx',
          responses: {
            204: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      response: {
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

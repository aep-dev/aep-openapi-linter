const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0132', 'aep-132-operation-id');
  return linter;
});

test('aep-132-operation-id should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          responses: {
            200: {
              description: 'Ok',
            },
          },
        },
      },
      '/test2': {
        get: {
          operationId: 'random',
        },
      },
      '/test3': {
        get: {
          operationId: 'GetAllTest3s',
          responses: {
            200: {
              description: 'Ok',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      'x-aep-resource': {
                        singleton: false,
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
      path: ['paths', '/test1', 'get'],
      message: 'The operation ID does not conform to AEP-132',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2', 'get', 'operationId'],
      message: 'The operation ID does not conform to AEP-132',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test3'], // sadly the path is not more specific
      message: 'The operation ID does not conform to AEP-132',
    });
  });
});

test('aep-132-operation-id should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          operationId: 'listTest1s',
        },
      },
      '/test2': {
        get: {
          operationId: 'ListTest2s',
        },
      },
      '/test3': {
        get: {
          operationId: 'ListTest3s',
          responses: {
            200: {
              description: 'Ok',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      'x-aep-resource': {
                        singleton: false,
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
          operationId: 'GetTest',
        },
      },
      '/test4:fetch': {
        get: {
          operationId: ':fetch',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('aep-132-operation-id should not find errors for operation that returns a singleton resource', () => {
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

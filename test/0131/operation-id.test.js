const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0131', 'aep-131-operation-id');
  return linter;
});

test('aep-131-operation-id should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        get: {
          responses: {
            200: {
              description: 'Ok',
            },
          },
        },
      },
      '/test2/{id}': {
        get: {
          operationId: 'random',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results).toContainMatch({
      path: ['paths', '/test1/{id}', 'get'],
      message: 'The operation ID does not conform to AEP-131',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2/{id}', 'get', 'operationId'],
      message: 'The operation ID does not conform to AEP-131',
    });
  });
});

test('aep-131-operation-id should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        get: {
          operationId: 'getTest',
        },
      },
      '/test2/{id}': {
        get: {
          operationId: 'GetTest',
        },
      },
      '/test3': {
        get: {
          operationId: 'ListTest',
        },
      },
      '/test4/{id}:fetch': {
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

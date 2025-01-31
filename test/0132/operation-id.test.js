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
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'get'],
      message: 'The operation ID does not conform to AEP-132',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2', 'get', 'operationId'],
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
          operationId: 'listTest',
        },
      },
      '/test2': {
        get: {
          operationId: 'ListTest',
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

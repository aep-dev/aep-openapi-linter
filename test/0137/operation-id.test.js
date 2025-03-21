const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0137', 'aep-137-operation-id');
  return linter;
});

test('aep-137-operation-id should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        put: {
          description: 'Missing operationId',
          responses: {
            200: {
              description: 'Ok',
            },
          },
        },
      },
      '/test2/{id}': {
        put: {
          description: 'operationId does not start with Apply',
          operationId: 'random',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results).toContainMatch({
      path: ['paths', '/test1/{id}', 'put'],
      message: 'The operation ID does not conform to AEP-137',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2/{id}', 'put', 'operationId'],
      message: 'The operation ID does not conform to AEP-137',
    });
  });
});

test('aep-137-operation-id should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        put: {
          description: 'Correct operationId with recommended case',
          operationId: 'ApplyTest',
        },
      },
      '/test2/{id}': {
        put: {
          description: 'Check should be case insensitive',
          operationId: 'aPPLYTest',
        },
      },
      '/test3/{id}': {
        post: {
          description: 'Not a standard Apply method',
          operationId: 'whatever',
        },
      },
      '/test4/{id}:deploy': {
        put: {
          description: 'Custom method',
          operationId: ':deploy',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

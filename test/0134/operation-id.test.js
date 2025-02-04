const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0134', 'aep-134-operation-id');
  return linter;
});

test('aep-134-operation-id should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        patch: {
          description: 'Missing operationId',
          responses: {
            200: {
              description: 'Ok',
            },
          },
        },
      },
      '/test2/{id}': {
        patch: {
          description: 'operationId does not start with Update',
          operationId: 'random',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results).toContainMatch({
      path: ['paths', '/test1/{id}', 'patch'],
      message: 'The operation ID does not conform to AEP-134',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2/{id}', 'patch', 'operationId'],
      message: 'The operation ID does not conform to AEP-134',
    });
  });
});

test('aep-134-operation-id should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        patch: {
          description: 'Correct operationId with recommended case',
          operationId: 'UpdateTest',
        },
      },
      '/test2/{id}': {
        patch: {
          description: 'Check should be case insensitive',
          operationId: 'uPDATETest',
        },
      },
      '/test3/{id}': {
        post: {
          description: 'Not a standard update method',
          operationId: 'whatever',
        },
      },
      '/test4/{id}:deploy': {
        patch: {
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

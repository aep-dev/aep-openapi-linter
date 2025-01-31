const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0133', 'aep-133-operation-id');
  return linter;
});

test('aep-133-operation-id should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        post: {
          responses: {
            200: {
              description: 'Ok',
            },
          },
        },
      },
      '/test2': {
        post: {
          operationId: 'random',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'post'],
      message: 'The operation ID does not conform to AEP-133.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2', 'post', 'operationId'],
      message: 'The operation ID does not conform to AEP-133.',
    });
  });
});

test('aep-133-operation-id should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        post: {
          operationId: 'createTest',
        },
      },
      '/test2': {
        post: {
          operationId: 'CreateTest',
        },
      },
      '/test3/{id}': {
        post: {
          operationId: 'whatever',
        },
      },
      '/test4:deploy': {
        post: {
          operationId: ':deploy',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0144', 'aep-144-operation-id');
  return linter;
});

test('aep-144-operation-id should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test2:addTest': {
        post: {
          operationId: 'random',
        },
      },
      '/test2:removeTest': {
        post: {
          operationId: ':removeTest',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results).toContainMatch({
      path: ['paths', '/test2:addTest', 'post', 'operationId'],
      message: 'The operation ID does not conform to AEP-144.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2:removeTest', 'post', 'operationId'],
      message: 'The operation ID does not conform to AEP-144.',
    });
  });
});

test('aep-144-operation-id should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test3:addTest': {
        post: {
          operationId: 'addTest',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

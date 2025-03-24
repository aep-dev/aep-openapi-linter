const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0136', 'aep-136-custom-operation-id');
  return linter;
});

test('aep-136-custom-operation-id should find warnings', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test2/{id}:unarchive': {
        post: {
          operationId: 'random',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      path: ['paths', '/test2/{id}:unarchive', 'post', 'operationId'],
      message: 'The operation ID does not conform to AEP-136',
    });
  });
});

test('aep-136-custom-operation-id should find no warnings', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test3/{id}:clear': {
        post: {
          operationId: ':ClearOperation',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

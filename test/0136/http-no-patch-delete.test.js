const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0136', 'aep-136-no-patch-delete');
  return linter;
});

test('aep-136-no-patch-delete should find warnings', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}:archive': {
        patch: {},
        'x-custom': true,
      },
      '/test2/{id}:restart': {
        delete: {},
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results).toContainMatch({
      path: ['paths', '/test1/{id}:archive'],
      message: 'Custom methods should not use PATCH or DELETE.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2/{id}:restart'],
      message: 'Custom methods should not use PATCH or DELETE.',
    });
  });
});

test('aep-136-no-patch-delete should find no warnings', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}:archive': {
        post: {},
      },
      '/test3/{id}:unarchive': {
        post: {},
      },
      '/test3/{id}': {
        delete: {},
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0136', 'aep-136-http-method');
  return linter;
});

test('aep-136-http-method should find warnings', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}:archive': {
        delete: {},
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      path: ['paths', '/test1/{id}:archive'],
      message: 'Custom methods should use POST or GET.',
    });
  });
});

test('aep-136-http-method should find no warnings', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}:archive': {
        post: {},
      },
      '/test3/{id}:unarchive': {
        post: {},
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

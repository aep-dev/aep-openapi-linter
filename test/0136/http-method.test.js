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
      '/test1/{id}:check': {
        head: {},
      },
      '/test1/{id}:options': {
        options: {},
      },
      '/test1/{id}:clone': {
        put: {},
      },
      '/test1/{id}:update': {
        patch: {},
      },
      '/test1/{id}:trace': {
        trace: {},
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(6);
    expect(results).toContainMatch({
      path: ['paths', '/test1/{id}:archive'],
      message: 'Custom methods should use POST or GET.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1/{id}:check'],
      message: 'Custom methods should use POST or GET.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1/{id}:options'],
      message: 'Custom methods should use POST or GET.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1/{id}:clone'],
      message: 'Custom methods should use POST or GET.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1/{id}:update'],
      message: 'Custom methods should use POST or GET.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1/{id}:trace'],
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
      '/test2/{id}:check': {
        get: {},
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

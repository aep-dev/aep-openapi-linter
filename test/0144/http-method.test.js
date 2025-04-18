const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0144', 'aep-144-http-method');
  return linter;
});

test('aep-144-http-method should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1:addTest': {
        put: {},
      },
      '/test1:removeTest': {
        delete: {},
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results).toContainMatch({
      path: ['paths', '/test1:addTest'],
      message: 'An Update Array operation must be POST.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test1:removeTest'],
      message: 'An Update Array operation must be POST.',
    });
  });
});

test('aep-144-http-method should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1:addTest': {
        post: {},
      },
      '/test3:removeTest': {
        post: {},
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

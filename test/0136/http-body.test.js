const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0136', 'aep-136-http-body');
  return linter;
});

test('aep-136-http-body should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}:custom': {
        get: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      path: ['paths', '/test1/{id}:custom', 'get', 'requestBody'],
      message: 'GET-based custom methods must have no request body.',
    });
  });
});

test('aep-136-http-body should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}:custom': {
        get: {},
      },
      '/test3/{id}:custom': {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
        put: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
        patch: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

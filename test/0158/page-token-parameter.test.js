const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0158', 'aep-158-page-token-parameter');
  return linter;
});

test('aep-158-page-token-parameter should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          description: 'No parameters',
        },
      },
      '/test2': {
        get: {
          description: 'No page_token parameter',
          parameters: [],
        },
      },
      '/test3': {
        get: {
          description: 'page_token parameter is not a string',
          parameters: [
            {
              name: 'page_token',
              in: 'query',
              schema: {
                type: 'integer',
              },
            },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    const message = 'Operations that return collections should define a string page_token parameter.';
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'get'],
      message,
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2', 'get', 'parameters'],
      message,
    });
    // Unfortunately we don't get the path to the incorrect type value here
    expect(results).toContainMatch({
      path: ['paths', '/test3', 'get', 'parameters'],
      message,
    });
  });
});

test('aep-158-page-token-parameter should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          parameters: [
            {
              name: 'page_token',
              in: 'query',
              schema: {
                type: 'string',
              },
            },
          ],
        },
      },
      '/test2': {
        post: {
          description: 'page_token is not required for post',
        },
        put: {
          description: 'page_token is not required for put',
        },
        patch: {
          description: 'page_token is not required for patch',
        },
        delete: {
          description: 'page_token is not required for delete',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

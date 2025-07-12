const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0158', 'aep-158-max-page-size-parameter');
  return linter;
});

test('aep-158-max-page-size-parameter should find errors', () => {
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
          description: 'No max_page_size parameter',
          parameters: [],
        },
      },
      '/test3': {
        get: {
          description: 'max_page_size parameter is not an integer',
          parameters: [
            {
              name: 'max_page_size',
              in: 'query',
              schema: {
                type: 'string',
              },
            },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    const message = 'Operations that return collections should define an integer max_page_size parameter.';
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

test('aep-158-max-page-size-parameter should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          parameters: [
            {
              name: 'max_page_size',
              in: 'query',
              schema: {
                type: 'integer',
              },
            },
          ],
        },
      },
      '/test2': {
        post: {
          description: 'max_page_size is not required for post',
        },
        put: {
          description: 'max_page_size is not required for put',
        },
        patch: {
          description: 'max_page_size is not required for patch',
        },
        delete: {
          description: 'max_page_size is not required for delete',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('aep-158-max-page-size-parameter should not find errors for operation on singleton resource', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          operationId: 'getTest',
          responses: {
            200: {
              description: 'Ok',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    'x-aep-resource': {
                      singleton: true,
                    },
                  },
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

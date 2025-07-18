const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0151', 'aep-151-202-only-success');
});

test('aep-151-202-only-success should find errors when other success codes are present', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        post: {
          responses: {
            200: {
              description: 'OK',
            },
            202: {
              description: 'Accepted',
            },
          },
        },
      },
      '/test2': {
        put: {
          responses: {
            201: {
              description: 'Created',
            },
            202: {
              description: 'Accepted',
            },
          },
        },
      },
      '/test3': {
        delete: {
          responses: {
            204: {
              description: 'No Content',
            },
            202: {
              description: 'Accepted',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results).toContainMatch({
      path: ['paths', '/test', 'post', 'responses'],
      message: 'Long-running operations must return 202 as the only success status code',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2', 'put', 'responses'],
      message: 'Long-running operations must return 202 as the only success status code',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test3', 'delete', 'responses'],
      message: 'Long-running operations must return 202 as the only success status code',
    });
  });
});

test('aep-151-202-only-success should find no errors when only 202 is present', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        post: {
          responses: {
            202: {
              description: 'Accepted',
            },
            400: {
              description: 'Bad Request',
            },
            500: {
              description: 'Internal Server Error',
            },
          },
        },
      },
      '/test2': {
        put: {
          responses: {
            202: {
              description: 'Accepted',
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

test('aep-151-202-only-success should find no errors when no 202 response is present', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        post: {
          responses: {
            200: {
              description: 'OK',
            },
          },
        },
      },
      '/test2': {
        get: {
          responses: {
            200: {
              description: 'OK',
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

test('aep-151-202-only-success should handle falsy responses gracefully', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        post: {
          responses: null,
        },
      },
      '/test2': {
        put: {
          responses: undefined,
        },
      },
      '/test3': {
        delete: {
          responses: '',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('aep-151-202-only-success should handle non-object responses gracefully', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        post: {
          responses: 'not an object',
        },
      },
      '/test2': {
        put: {
          responses: 123,
        },
      },
      '/test3': {
        delete: {
          responses: [],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

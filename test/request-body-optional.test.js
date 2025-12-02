const { linterForRule } = require('./utils');

let linter;

beforeAll(async () => {
  linter = await linterForRule('aep-request-body-optional');
  return linter;
});

test('aep-request-body-optional should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        'x-aep-resource': 'example.com/Test1',
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
      },
      '/test2': {
        'x-aep-resource': 'example.com/Test2',
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
      '/test3': {
        'x-aep-resource': 'example.com/Test3',
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
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results[0].path.join('.')).toBe('paths./test1.put.requestBody');
    expect(results[1].path.join('.')).toBe('paths./test2.patch.requestBody');
    expect(results[2].path.join('.')).toBe('paths./test3.post.requestBody');
  });
});

test('aep-request-body-optional should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        'x-aep-resource': 'example.com/Test1',
        put: {
          requestBody: {
            required: true,
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
      '/test2': {
        'x-aep-resource': 'example.com/Test2',
        patch: {
          requestBody: {
            required: true,
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
      '/test3': {
        'x-aep-resource': 'example.com/Test3',
        post: {
          requestBody: {
            required: true,
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

test('aep-request-body-optional should not apply without x-aep-resource', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        // No x-aep-resource, so rule should not apply even though this violates the rule
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
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

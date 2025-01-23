const { linterForAepRule } = require('../utils');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0133', 'aep-133-request-body');
  return linter;
});

test('aep-133-request-body should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        post: {
          description: 'No request body',
          responses: {
            200: {
              description: 'OK',
            },
          },
        },
      },
      '/test2': {
        post: {
          description: 'Request body that does not have content',
          requestBody: {
            description: 'No content',
          },
          responses: {
            200: {
              description: 'OK',
            },
          },
        },
      },
      '/test3': {
        post: {
          description: 'Request body without x-aep-resource extension',
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
      '/test4': {
        post: {
          description: 'Request body is $ref to schema without x-aep-resource extension',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Test3',
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Test3: {
          description: 'Schema without x-aep-resource extension',
          type: 'object',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(4);
    const paths = results.map(({ path }) => path.join('.'));
    expect(paths).toContain('paths./test1.post');
    expect(paths).toContain('paths./test2.post.requestBody');
    expect(paths).toContain('paths./test3.post.requestBody.content.application/json.schema');
    expect(paths).toContain('paths./test4.post.requestBody.content.application/json.schema');
  });
});

test('aep-133-request-body should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  'x-aep-resource': true,
                },
              },
            },
          },
        },
      },
      '/test2': {
        description: 'Methods other than POST are not checked',
        get: {
          responses: {
            200: {
              description: 'OK',
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

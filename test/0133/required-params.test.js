const { linterForAepRule } = require('../utils');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0133', 'aep-133-required-params');
  return linter;
});

test('aep-133-required-params should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        post: {
          parameters: [
            {
              name: 'force',
              in: 'query',
              required: true,
              schema: {
                type: 'boolean',
              },
            },
          ],
        },
      },
      '/test2': {
        parameters: [
          {
            name: 'force',
            in: 'query',
            required: true,
            schema: {
              type: 'boolean',
            },
          },
        ],
        post: {
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
    expect(results.length).toBe(2);
    const paths = results.map(({ path }) => path.join('.'));
    expect(paths).toContain('paths./test1.post.parameters.0.required');
    expect(paths).toContain('paths./test2.parameters.0.required');
  });
});

test('aep-133-required-params should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      // No parameters
      '/test1': {
        post: {},
      },
      // required path parameters, optional query parameters
      '/test1/{id}/test2': {
        post: {
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'force',
              in: 'query',
              schema: {
                type: 'boolean',
              },
            },
          ],
        },
      },
    },
    // required params in other methods are not flagged
    '/test3': {
      get: {
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
      },
      put: {
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
      },
      patch: {
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

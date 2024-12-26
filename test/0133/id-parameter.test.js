const { linterForAepRule } = require('../utils');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0133', 'aep-133-id-parameter');
  return linter;
});

test('aep-133-id-parameter should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        post: {
          description: 'No parameters',
        },
      },
      '/test2': {
        post: {
          description: 'No id parameter',
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
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    const paths = results.map(({ path }) => path.join('.'));
    expect(paths).toContain('paths./test1.post');
    expect(paths).toContain('paths./test2.post.parameters');
  });
});

test('aep-133-id-parameter should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        post: {
          parameters: [
            {
              name: 'id',
              in: 'query',
              schema: {
                type: 'string',
              },
            },
          ],
        },
      },
      // required path parameters, optional query parameters
      '/test1/{testId}/test2': {
        post: {
          parameters: [
            {
              name: 'testId',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'id',
              in: 'query',
              schema: {
                type: 'string',
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

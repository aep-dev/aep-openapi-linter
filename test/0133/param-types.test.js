const { linterForAepRule } = require('../utils');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0133', 'aep-133-param-types');
  return linter;
});

test('aep-133-param-types should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        post: {
          description: 'id parameter is not query parameter',
          parameters: [
            {
              name: 'id',
              in: 'header',
              schema: {
                type: 'string',
              },
            },
          ],
        },
      },
      '/test2': {
        post: {
          description: 'id parameter is not type string',
          parameters: [
            {
              name: 'id',
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
    expect(results.length).toBe(2);
    const paths = results.map(({ path }) => path.join('.'));
    expect(paths).toContain('paths./test1.post.parameters.0.in');
    expect(paths).toContain('paths./test2.post.parameters.0.schema.type');
  });
});

test('aep-133-param-types should find no errors', () => {
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
    },
    // id params in other methods are not flagged
    '/test2/{id}': {
      get: {
        parameters: [
          {
            name: 'id',
            in: 'path',
            schema: {
              type: 'string',
            },
          },
        ],
      },
      put: {
        parameters: [
          {
            name: 'id',
            in: 'path',
            schema: {
              type: 'string',
            },
          },
        ],
      },
      patch: {
        parameters: [
          {
            name: 'id',
            in: 'path',
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

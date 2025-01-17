const { linterForAepRule } = require('../utils');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0132', 'aep-132-param-types');
  return linter;
});

test('aep-132-param-types should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          parameters: [
            {
              name: 'filter',
              in: 'query',
              schema: {
                type: 'object',
              },
            },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    // This rule currently triggers multiple times on the same parameter
    // That isn't ideal but it does trigger so for now we'll let this pass
    expect(results.length).toBeGreaterThan(1);
    const paths = results.map(({ path }) => path.join('.'));
    expect(paths).toContain('paths./test1.get.parameters.0');
  });
});

test('aep-132-param-types should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {},
      },
      '/test3': {
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

const { linterForAepRule } = require('../utils');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0132', 'aep-132-http-body');
  return linter;
});

test('aep-132-http-body should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
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
    expect(results[0].path.join('.')).toBe('paths./test1.get.requestBody');
  });
});

test('aep-132-http-body should find no errors', () => {
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

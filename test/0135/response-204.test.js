const { linterForAepRule } = require('../utils');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0135', 'aep-135-response-204');
  return linter;
});

test('aep-135-response-204 should find errors', () => {
  const myOpenApiDocument = {
    openapi: '3.0.3',
    paths: {
      '/api/Paths': {
        delete: {
          responses: {
            200: {
              description: 'Success',
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1);
    expect(results[0].path.join('.')).toBe(
      'paths./api/Paths.delete.responses'
    );
  });
});

test('aep-135-response-204 should find no errors', () => {
  const myOpenApiDocument = {
    openapi: '3.0.3',
    paths: {
      '/api/Paths': {
        delete: {
          responses: {
            204: {
              description: 'Success',
            },
          },
        },
      },
      '/test202': {
        delete: {
          responses: {
            202: {
              description: 'Success',
            },
          },
        },
      },
    },
  };
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});

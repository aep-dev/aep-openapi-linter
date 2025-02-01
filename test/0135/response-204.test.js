const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0135', 'aep-135-response-204');
  return linter;
});

test('aep-135-response-204 should find errors', () => {
  const myOpenApiDocument = {
    openapi: '3.0.3',
    paths: {
      '/api/Paths/{id}': {
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
    expect(results).toContainMatch({
      path: ['paths', '/api/Paths/{id}', 'delete', 'responses'],
      message: 'A delete operation should have a `204` response.',
    });
  });
});

test('aep-135-response-204 should find no errors', () => {
  const myOpenApiDocument = {
    openapi: '3.0.3',
    paths: {
      '/api/Paths/{id}': {
        delete: {
          responses: {
            204: {
              description: 'Success',
            },
          },
        },
      },
      '/test202/{id}': {
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

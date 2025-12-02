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
        'x-aep-resource': 'example.com/Path',
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
        'x-aep-resource': 'example.com/Path',
        delete: {
          responses: {
            204: {
              description: 'Success',
            },
          },
        },
      },
      '/test202/{id}': {
        'x-aep-resource': 'example.com/Test202',
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

test('aep-135-response-204 should not apply without x-aep-resource', () => {
  const myOpenApiDocument = {
    openapi: '3.0.3',
    paths: {
      '/api/Paths/{id}': {
        // No x-aep-resource, so rule should not apply even though this violates the rule
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
    expect(results.length).toBe(0);
  });
});

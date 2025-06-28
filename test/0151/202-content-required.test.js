const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0151', 'aep-151-202-content-required');
  return linter;
});

test('aep-151-202-content-required should find errors when content property is missing', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        post: {
          responses: {
            202: {
              description: 'Accepted',
              // missing content
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      path: ['paths', '/test', 'post', 'responses', '202'],
      message: '202 response must define an application/json response body with Operation schema',
    });
  });
});

test('aep-151-202-content-required should find no errors when content property is present', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        post: {
          responses: {
            202: {
              description: 'Accepted',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      path: { type: 'string' },
                      done: { type: 'boolean' },
                      error: { type: 'object' },
                      response: { type: 'object' },
                    },
                  },
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

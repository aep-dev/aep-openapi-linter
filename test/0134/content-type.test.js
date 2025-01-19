const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0134', 'aep-134-content-type');
  return linter;
});

test('aep-134-content-type should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        patch: {
          description: 'No request body',
          responses: {
            200: {
              description: 'Ok',
            },
          },
        },
      },
      '/test2/{id}': {
        patch: {
          description: 'Request body does not have content',
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
      '/test3/{id}': {
        patch: {
          description: 'Request body content does not have application/merge-patch+json',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results).toContainMatch({
      path: ['paths', '/test1/{id}', 'patch'],
      message: 'The request body content type should be "application/merge-patch+json"',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2/{id}', 'patch', 'requestBody'],
      message: 'The request body content type should be "application/merge-patch+json"',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test3/{id}', 'patch', 'requestBody', 'content'],
      message: 'The request body content type should be "application/merge-patch+json"',
    });
  });
});

test('aep-134-content-type should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        patch: {
          description: 'Request body content has application/merge-patch+json',
          requestBody: {
            content: {
              'application/merge-patch+json': {
                schema: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    if (results.length > 0) {
      console.warn(results);
    }
    expect(results.length).toBe(0);
  });
});

const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0133', 'aep-133-unknown-optional-params');
  return linter;
});

test('aep-133-unknown-optional-params should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        post: {
          parameters: [
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
      '/test2': {
        parameters: [
          {
            name: 'force',
            in: 'query',
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
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'post', 'parameters', '0', 'name'],
      message: 'A create operation should not have unknown optional parameters.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2', 'parameters', '0', 'name'],
      message: 'A create operation should not have unknown optional parameters.',
    });
  });
});

test('aep-133-unknown-optional-params should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      // No parameters
      '/test1': {
        post: {},
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
    // optional params in other methods are not flagged
    '/test3': {
      get: {
        parameters: [
          {
            name: 'q',
            in: 'query',
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

const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0137', 'aep-137-unknown-optional-params');
  return linter;
});

test('aep-137-unknown-optional-params should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        put: {
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
      '/test2/{id}': {
        parameters: [
          {
            name: 'force',
            in: 'query',
            schema: {
              type: 'boolean',
            },
          },
        ],
        put: {
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
      path: ['paths', '/test1/{id}', 'put', 'parameters', '0', 'name'],
      message: 'A standard Apply method should not have unknown optional parameters.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2/{id}', 'parameters', '0', 'name'],
      message: 'A standard Apply method should not have unknown optional parameters.',
    });
  });
});

test('aep-137-unknown-optional-params should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      // No parameters
      '/test1/{id}': {
        put: {},
      },
      // required path parameters, optional header parameters
      '/test1/{testId}/test2/{id}': {
        put: {
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
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'force',
              in: 'header',
              schema: {
                type: 'boolean',
              },
            },
          ],
        },
      },
    },
    // optional params in other methods are not flagged
    '/test3/{id}': {
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
      post: {
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
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

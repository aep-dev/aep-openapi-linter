const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0134', 'aep-134-required-params');
  return linter;
});

test('aep-134-required-params should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        patch: {
          parameters: [
            {
              name: 'force',
              in: 'query',
              required: true,
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
            required: true,
            schema: {
              type: 'boolean',
            },
          },
        ],
        patch: {
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
      path: ['paths', '/test1/{id}', 'patch', 'parameters', '0', 'required'],
      message: 'A standard update method must not have any required parameters other than path parameters.',
    });
    expect(results).toContainMatch({
      path: ['paths', '/test2/{id}', 'parameters', '0', 'required'],
      message: 'A standard update method must not have any required parameters other than path parameters.',
    });
  });
});

test('aep-134-required-params should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      // No parameters
      '/test1/{id}': {
        patch: {},
      },
      // required path parameters, optional query parameters
      '/test1/{id1}/test2/{id2}': {
        patch: {
          parameters: [
            {
              name: 'id1',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
            },
            {
              name: 'id2',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
              },
            },
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
    },
    // required params in other methods are not flagged
    '/test3/{id}': {
      get: {
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
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
            required: true,
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
            required: true,
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

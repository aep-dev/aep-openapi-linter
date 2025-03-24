const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0140', 'aep-140-boolean-field-naming');
  return linter;
});

test('aep-140-boolean-field-naming should find warning', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      is_boolean: {
                        type: 'boolean',
                      },
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
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      path: [
        'paths',
        '/test1',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'is_boolean',
      ],
      message: 'Boolean fields should omit the prefix "is".',
    });
  });
});

test('aep-140-boolean-field-naming should find no warnings', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      boolean: {
                        type: 'boolean',
                      },
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

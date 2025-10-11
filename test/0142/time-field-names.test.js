const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0142', 'aep-142-time-field-names');
  return linter;
});

test('aep-142-time-field-names should find warnings for past tense names', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      created: {
                        type: 'string',
                        format: 'date-time',
                      },
                      updated: {
                        type: 'string',
                        format: 'date-time',
                      },
                      modified: {
                        type: 'string',
                        format: 'date-time',
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
    expect(results.length).toBe(3);
    expect(results).toContainMatch({
      path: [
        'paths',
        '/test',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'created',
      ],
      message: 'Use imperative mood with "_time" suffix (e.g., "created_time") instead of past tense.',
    });
    expect(results).toContainMatch({
      path: [
        'paths',
        '/test',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'updated',
      ],
    });
    expect(results).toContainMatch({
      path: [
        'paths',
        '/test',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'modified',
      ],
    });
  });
});

test('aep-142-time-field-names should find no warnings for correct names', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      create_time: {
                        type: 'string',
                        format: 'date-time',
                      },
                      update_time: {
                        type: 'string',
                        format: 'date-time',
                      },
                      modify_time: {
                        type: 'string',
                        format: 'date-time',
                      },
                      publish_time: {
                        type: 'string',
                        format: 'date-time',
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

test('aep-142-time-field-names should not flag non-timestamp fields', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      created: {
                        type: 'boolean',
                      },
                      updated: {
                        type: 'string',
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

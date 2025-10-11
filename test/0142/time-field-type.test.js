const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0142', 'aep-142-time-field-type');
  return linter;
});

test('aep-142-time-field-type should find warning when missing format', () => {
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
        '/test',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'create_time',
      ],
      message: 'Timestamp field should have type "string" and format "date-time".',
    });
  });
});

test('aep-142-time-field-type should find warning when wrong type', () => {
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
                      update_time: {
                        type: 'integer',
                        format: 'int64',
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
      message: 'Timestamp field should have type "string" and format "date-time".',
    });
  });
});

test('aep-142-time-field-type should find no warnings for correct format', () => {
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

test('aep-142-time-field-type should not flag non-time fields', () => {
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
                      name: {
                        type: 'string',
                      },
                      runtime: {
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

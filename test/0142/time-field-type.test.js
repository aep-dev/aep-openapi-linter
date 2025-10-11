const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0142', 'aep-142-time-field-type');
  return linter;
});

// Tests for timestamp fields (_time, _datetime, _timestamp)

test('aep-142-time-field-type should find warning when _time field missing format', () => {
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
      message: 'Field "create_time" should have type "string" and format "date-time" (RFC 3339 timestamp).',
    });
  });
});

test('aep-142-time-field-type should find warning when _time field has wrong type', () => {
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
      message: 'Field "update_time" should have type "string" and format "date-time" (RFC 3339 timestamp).',
    });
  });
});

test('aep-142-time-field-type should validate _times suffix (array)', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Event: {
          type: 'object',
          properties: {
            sample_times: {
              type: 'array',
              items: {
                type: 'integer',
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
      message: 'Field "sample_times" should have type "string" and format "date-time" (RFC 3339 timestamp).',
    });
  });
});

// Tests for date fields (_date)

test('aep-142-time-field-type should validate _date suffix', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Person: {
          type: 'object',
          properties: {
            birth_date: {
              type: 'integer',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: 'Field "birth_date" should have type "string" and format "date" (RFC 3339 date).',
    });
  });
});

test('aep-142-time-field-type should accept correct _date field', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Person: {
          type: 'object',
          properties: {
            birth_date: {
              type: 'string',
              format: 'date',
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

// Tests for duration fields (seconds, milliseconds, etc.)

test('aep-142-time-field-type should validate _seconds suffix', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Resource: {
          type: 'object',
          properties: {
            ttl_seconds: {
              type: 'string',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: 'Field "ttl_seconds" should have type "integer" or "number" for duration values.',
    });
  });
});

test('aep-142-time-field-type should accept correct _seconds field', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Resource: {
          type: 'object',
          properties: {
            ttl_seconds: {
              type: 'integer',
            },
            offset_seconds: {
              type: 'number',
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

test('aep-142-time-field-type should validate _millis suffix', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Metric: {
          type: 'object',
          properties: {
            timeout_millis: {
              type: 'string',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: 'Field "timeout_millis" should have type "integer" or "number" for duration values.',
    });
  });
});

test('aep-142-time-field-type should validate _micros suffix', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Timing: {
          type: 'object',
          properties: {
            delay_micros: {
              type: 'string',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: 'Field "delay_micros" should have type "integer" or "number" for duration values.',
    });
  });
});

test('aep-142-time-field-type should validate _nanos suffix', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Timing: {
          type: 'object',
          properties: {
            precision_nanos: {
              type: 'string',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: 'Field "precision_nanos" should have type "integer" or "number" for duration values.',
    });
  });
});

// Tests for correct timestamp fields

test('aep-142-time-field-type should find no warnings for correct timestamp formats', () => {
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

// Tests for non-time fields

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

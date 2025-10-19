const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0142', 'aep-142-time-field-suffix');
  return linter;
});

// Tests for timestamp fields without _time suffix

test('aep-142-time-field-suffix should flag timestamp field without _time suffix', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            published: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: 'Timestamp field "published" should end with "_time" suffix.',
    });
  });
});

test('aep-142-time-field-suffix should flag "expiration" field', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Token: {
          type: 'object',
          properties: {
            expiration: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: 'Timestamp field "expiration" should end with "_time" suffix.',
    });
  });
});

test('aep-142-time-field-suffix should flag "scheduled_at" field', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Event: {
          type: 'object',
          properties: {
            scheduled_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: 'Timestamp field "scheduled_at" should end with "_time" suffix.',
    });
  });
});

test('aep-142-time-field-suffix should flag simple "timestamp" field', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Log: {
          type: 'object',
          properties: {
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: 'Timestamp field "timestamp" should end with "_time" suffix.',
    });
  });
});

test('aep-142-time-field-suffix should flag "publish_date" field', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Article: {
          type: 'object',
          properties: {
            publish_date: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: 'Timestamp field "publish_date" should end with "_time" suffix.',
    });
  });
});

// Tests for correct timestamp fields with _time suffix

test('aep-142-time-field-suffix should accept fields with _time suffix', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
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
            publish_time: {
              type: 'string',
              format: 'date-time',
            },
            delete_time: {
              type: 'string',
              format: 'date-time',
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

// Tests for non-timestamp fields (should not be checked)

test('aep-142-time-field-suffix should not flag non-timestamp fields', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Resource: {
          type: 'object',
          properties: {
            published: {
              type: 'boolean',
            },
            expiration: {
              type: 'string',
            },
            timestamp: {
              type: 'integer',
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

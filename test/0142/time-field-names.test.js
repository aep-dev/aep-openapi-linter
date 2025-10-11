const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0142', 'aep-142-time-field-names');
  return linter;
});

// Tests for exact past-tense names

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

// Tests for new field names added from Google's linter

test('aep-142-time-field-names should flag "creation" field name', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            creation: {
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
      message: 'Use imperative mood with "_time" suffix (e.g., "creation_time") instead of past tense.',
    });
  });
});

test('aep-142-time-field-names should flag "expired" field name', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Token: {
          type: 'object',
          properties: {
            expired: {
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
      message: 'Use imperative mood with "_time" suffix (e.g., "expired_time") instead of past tense.',
    });
  });
});

test('aep-142-time-field-names should flag "purged" field name', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Resource: {
          type: 'object',
          properties: {
            purged: {
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
      message: 'Use imperative mood with "_time" suffix (e.g., "purged_time") instead of past tense.',
    });
  });
});

// Tests for compound names with past-tense words (contains matching)

test('aep-142-time-field-names should flag "last_modified" (contains modified)', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Document: {
          type: 'object',
          properties: {
            last_modified: {
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
      message: 'Use imperative mood with "_time" suffix (e.g., "last_modified_time") instead of past tense.',
    });
  });
});

test('aep-142-time-field-names should flag "time_created" (contains created)', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Record: {
          type: 'object',
          properties: {
            time_created: {
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
      message: 'Use imperative mood with "_time" suffix (e.g., "time_created_time") instead of past tense.',
    });
  });
});

test('aep-142-time-field-names should flag "document_published" (contains published)', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Article: {
          type: 'object',
          properties: {
            document_published: {
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
      message: 'Use imperative mood with "_time" suffix (e.g., "document_published_time") instead of past tense.',
    });
  });
});

// Tests for correct naming

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

// Tests for non-timestamp fields

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

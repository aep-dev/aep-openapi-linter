const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0143', 'aep-143-standardized-codes-string-type');
  return linter;
});

describe('aep-143-standardized-codes-string-type', () => {
  test('should flag "language_code" with non-string type', () => {
    const oasDoc = {
      openapi: '3.0.3',
      components: {
        schemas: {
          Book: {
            type: 'object',
            properties: {
              language_code: {
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
        path: ['components', 'schemas', 'Book', 'properties', 'language_code', 'type'],
        message: expect.stringContaining('should be of type "string"'),
      });
    });
  });

  test('should flag "region_code" with non-string type', () => {
    const oasDoc = {
      openapi: '3.0.3',
      components: {
        schemas: {
          Address: {
            type: 'object',
            properties: {
              region_code: {
                type: 'number',
              },
            },
          },
        },
      },
    };
    return linter.run(oasDoc).then((results) => {
      expect(results.length).toBe(1);
      expect(results).toContainMatch({
        path: ['components', 'schemas', 'Address', 'properties', 'region_code', 'type'],
        message: expect.stringContaining('should be of type "string"'),
      });
    });
  });

  test('should flag "currency_code" with non-string type', () => {
    const oasDoc = {
      openapi: '3.0.3',
      components: {
        schemas: {
          Price: {
            type: 'object',
            properties: {
              currency_code: {
                type: 'boolean',
              },
            },
          },
        },
      },
    };
    return linter.run(oasDoc).then((results) => {
      expect(results.length).toBe(1);
      expect(results).toContainMatch({
        path: ['components', 'schemas', 'Price', 'properties', 'currency_code', 'type'],
        message: expect.stringContaining('should be of type "string"'),
      });
    });
  });

  test('should flag "content_type" with non-string type', () => {
    const oasDoc = {
      openapi: '3.0.3',
      components: {
        schemas: {
          File: {
            type: 'object',
            properties: {
              content_type: {
                type: 'array',
              },
            },
          },
        },
      },
    };
    return linter.run(oasDoc).then((results) => {
      expect(results.length).toBe(1);
      expect(results).toContainMatch({
        path: ['components', 'schemas', 'File', 'properties', 'content_type', 'type'],
        message: expect.stringContaining('should be of type "string"'),
      });
    });
  });

  test('should flag "time_zone" with non-string type', () => {
    const oasDoc = {
      openapi: '3.0.3',
      components: {
        schemas: {
          Event: {
            type: 'object',
            properties: {
              time_zone: {
                type: 'object',
              },
            },
          },
        },
      },
    };
    return linter.run(oasDoc).then((results) => {
      expect(results.length).toBe(1);
      expect(results).toContainMatch({
        path: ['components', 'schemas', 'Event', 'properties', 'time_zone', 'type'],
        message: expect.stringContaining('should be of type "string"'),
      });
    });
  });

  test('should flag "utc_offset" with non-string type', () => {
    const oasDoc = {
      openapi: '3.0.3',
      components: {
        schemas: {
          TimeInfo: {
            type: 'object',
            properties: {
              utc_offset: {
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
        path: ['components', 'schemas', 'TimeInfo', 'properties', 'utc_offset', 'type'],
        message: expect.stringContaining('should be of type "string"'),
      });
    });
  });

  test('should not flag standardized code fields with correct string type', () => {
    const oasDoc = {
      openapi: '3.0.3',
      components: {
        schemas: {
          CompliantResource: {
            type: 'object',
            properties: {
              language_code: {
                type: 'string',
              },
              region_code: {
                type: 'string',
              },
              currency_code: {
                type: 'string',
              },
              content_type: {
                type: 'string',
              },
              time_zone: {
                type: 'string',
              },
              utc_offset: {
                type: 'string',
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

  test('should not flag unrelated fields with non-string types', () => {
    const oasDoc = {
      openapi: '3.0.3',
      components: {
        schemas: {
          Book: {
            type: 'object',
            properties: {
              page_count: {
                type: 'integer',
              },
              is_available: {
                type: 'boolean',
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

  test('should flag multiple standardized code fields with non-string types', () => {
    const oasDoc = {
      openapi: '3.0.3',
      components: {
        schemas: {
          InvalidResource: {
            type: 'object',
            properties: {
              language_code: {
                type: 'integer',
              },
              currency_code: {
                type: 'number',
              },
            },
          },
        },
      },
    };
    return linter.run(oasDoc).then((results) => {
      expect(results.length).toBe(2);
    });
  });
});

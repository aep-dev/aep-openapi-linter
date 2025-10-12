const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0143', 'aep-143-standardized-codes');
  return linter;
});

describe('aep-143-standardized-codes', () => {
  test('should flag "lang" and suggest "language_code"', () => {
    const oasDoc = {
      openapi: '3.0.3',
      components: {
        schemas: {
          Book: {
            type: 'object',
            properties: {
              lang: {
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
        path: ['components', 'schemas', 'Book', 'properties', 'lang'],
        message: 'Use "language_code" instead of "lang" for standardized code fields.',
      });
    });
  });

  test('should flag "language" and suggest "language_code"', () => {
    const oasDoc = {
      openapi: '3.0.3',
      components: {
        schemas: {
          Book: {
            type: 'object',
            properties: {
              language: {
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
        path: ['components', 'schemas', 'Book', 'properties', 'language'],
        message: 'Use "language_code" instead of "language" for standardized code fields.',
      });
    });
  });

  test('should flag "country" and suggest "region_code"', () => {
    const oasDoc = {
      openapi: '3.0.3',
      components: {
        schemas: {
          Address: {
            type: 'object',
            properties: {
              country: {
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
        path: ['components', 'schemas', 'Address', 'properties', 'country'],
        message: 'Use "region_code" instead of "country" for standardized code fields.',
      });
    });
  });

  test('should flag "country_code" and suggest "region_code"', () => {
    const oasDoc = {
      openapi: '3.0.3',
      components: {
        schemas: {
          Address: {
            type: 'object',
            properties: {
              country_code: {
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
        path: ['components', 'schemas', 'Address', 'properties', 'country_code'],
        message: 'Use "region_code" instead of "country_code" for standardized code fields.',
      });
    });
  });

  test('should flag "currency" and suggest "currency_code"', () => {
    const oasDoc = {
      openapi: '3.0.3',
      components: {
        schemas: {
          Price: {
            type: 'object',
            properties: {
              currency: {
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
        path: ['components', 'schemas', 'Price', 'properties', 'currency'],
        message: 'Use "currency_code" instead of "currency" for standardized code fields.',
      });
    });
  });

  test('should flag "mime", "mimetype", and "mime_type" and suggest "content_type"', () => {
    const oasDoc = {
      openapi: '3.0.3',
      components: {
        schemas: {
          File: {
            type: 'object',
            properties: {
              mime: {
                type: 'string',
              },
              mimetype: {
                type: 'string',
              },
              mime_type: {
                type: 'string',
              },
            },
          },
        },
      },
    };
    return linter.run(oasDoc).then((results) => {
      expect(results.length).toBe(3);
      expect(results).toContainMatch({
        path: ['components', 'schemas', 'File', 'properties', 'mime'],
        message: 'Use "content_type" instead of "mime" for standardized code fields.',
      });
      expect(results).toContainMatch({
        path: ['components', 'schemas', 'File', 'properties', 'mimetype'],
        message: 'Use "content_type" instead of "mimetype" for standardized code fields.',
      });
      expect(results).toContainMatch({
        path: ['components', 'schemas', 'File', 'properties', 'mime_type'],
        message: 'Use "content_type" instead of "mime_type" for standardized code fields.',
      });
    });
  });

  test('should flag "tz" and "timezone" and suggest "time_zone"', () => {
    const oasDoc = {
      openapi: '3.0.3',
      components: {
        schemas: {
          Event: {
            type: 'object',
            properties: {
              tz: {
                type: 'string',
              },
              timezone: {
                type: 'string',
              },
            },
          },
        },
      },
    };
    return linter.run(oasDoc).then((results) => {
      expect(results.length).toBe(2);
      expect(results).toContainMatch({
        path: ['components', 'schemas', 'Event', 'properties', 'tz'],
        message: 'Use "time_zone" instead of "tz" for standardized code fields.',
      });
      expect(results).toContainMatch({
        path: ['components', 'schemas', 'Event', 'properties', 'timezone'],
        message: 'Use "time_zone" instead of "timezone" for standardized code fields.',
      });
    });
  });

  test('should not flag correct standardized field names', () => {
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

  test('should not flag unrelated field names', () => {
    const oasDoc = {
      openapi: '3.0.3',
      components: {
        schemas: {
          Book: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
              },
              author: {
                type: 'string',
              },
              description: {
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
});

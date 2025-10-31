const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0126', 'aep-126-enum-type-string');
  return linter;
});

test('aep-126-enum-type-string should find errors for integer enums', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            status: {
              type: 'integer',
              enum: [0, 1, 2],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      message: expect.stringMatching(/type.*string/i),
    });
  });
});

test('aep-126-enum-type-string should find errors for number enums', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            rating: {
              type: 'number',
              enum: [1.0, 2.0, 3.0, 4.0, 5.0],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      message: expect.stringMatching(/type.*string/i),
    });
  });
});

test('aep-126-enum-type-string should find no errors for string enums', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            format: {
              type: 'string',
              enum: ['HARDCOVER', 'PAPERBACK', 'EBOOK', 'AUDIOBOOK'],
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
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

test('aep-126-enum-type-string should allow nullable string enums', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            format: {
              type: 'string',
              nullable: true,
              enum: [null, 'HARDCOVER', 'PAPERBACK'],
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

test('aep-126-enum-type-string should allow OAS 3.1 type array with string and null', () => {
  const oasDoc = {
    openapi: '3.1.0',
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            format: {
              type: ['string', 'null'],
              enum: [null, 'HARDCOVER', 'PAPERBACK', 'EBOOK'],
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

test('aep-126-enum-type-string should reject OAS 3.1 type array with integer', () => {
  const oasDoc = {
    openapi: '3.1.0',
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            status: {
              type: ['integer', 'null'],
              enum: [null, 0, 1, 2],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      message: expect.stringMatching(/type.*string/i),
    });
  });
});

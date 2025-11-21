const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0126', 'aep-126-enum-null-first');
  return linter;
});

test('aep-126-enum-null-first should find warnings when null is not first', () => {
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
              enum: ['HARDCOVER', null, 'PAPERBACK'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      message: expect.stringMatching(/null.*first/i),
    });
  });
});

test('aep-126-enum-null-first should find warnings when null is last', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              nullable: true,
              enum: ['ELECTRONICS', 'BOOKS', 'CLOTHING', null],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      message: expect.stringMatching(/null.*first/i),
    });
  });
});

test('aep-126-enum-null-first should find no warnings when null is first', () => {
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

test('aep-126-enum-null-first should not flag non-nullable enums without null', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
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

test('aep-126-enum-null-first should not flag nullable enums without null in array', () => {
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
              enum: ['HARDCOVER', 'PAPERBACK'],
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

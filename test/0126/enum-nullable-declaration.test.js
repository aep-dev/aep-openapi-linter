const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0126', 'aep-126-enum-nullable-declaration');
  return linter;
});

test('aep-126-enum-nullable-declaration should find errors when null in enum but no nullable', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            format: {
              type: 'string',
              enum: [null, 'HARDCOVER', 'PAPERBACK'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: expect.stringMatching(/nullable.*true/i),
    });
  });
});

test('aep-126-enum-nullable-declaration should find errors when nullable is false', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              nullable: false,
              enum: [null, 'ELECTRONICS', 'BOOKS'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: expect.stringMatching(/nullable/i),
    });
  });
});

test('aep-126-enum-nullable-declaration should find no errors when nullable true', () => {
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

test('aep-126-enum-nullable-declaration should find no errors for enums without null', () => {
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

test('aep-126-enum-nullable-declaration should handle null in middle of array', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Order: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['PENDING', null, 'SHIPPED'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: expect.stringMatching(/nullable/i),
    });
  });
});

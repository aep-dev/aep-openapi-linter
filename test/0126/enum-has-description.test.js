const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0126', 'aep-126-enum-has-description');
  return linter;
});

test('aep-126-enum-has-description should find info messages for enums without description', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            format: {
              type: 'string',
              enum: ['HARDCOVER', 'PAPERBACK', 'EBOOK'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: expect.stringMatching(/description/i),
    });
  });
});

test('aep-126-enum-has-description should find info for multiple enums without descriptions', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Order: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['PENDING', 'SHIPPED', 'DELIVERED'],
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH'],
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

test('aep-126-enum-has-description should find no issues for enums with description', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            format: {
              type: 'string',
              description: 'The format in which the book is published',
              enum: ['HARDCOVER', 'PAPERBACK', 'EBOOK', 'AUDIOBOOK'],
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

test('aep-126-enum-has-description should accept empty string as description', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: '',
              enum: ['ELECTRONICS', 'BOOKS', 'CLOTHING'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    // Empty string is falsy, so it should still trigger
    expect(results.length).toBe(1);
  });
});

test('aep-126-enum-has-description should work with nullable enums', () => {
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
              description: 'Optional format of the book',
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

test('aep-126-enum-has-description should flag nullable enums without description', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Order: {
          type: 'object',
          properties: {
            priority: {
              type: 'string',
              nullable: true,
              enum: [null, 'LOW', 'HIGH'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
  });
});

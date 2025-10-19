const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0126', 'aep-126-enum-case-consistent');
  return linter;
});

test('aep-126-enum-case-consistent should find warnings for mixed case', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['active', 'PENDING', 'In_Progress'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: expect.stringMatching(/inconsistent case/i),
    });
  });
});

test('aep-126-enum-case-consistent should find warnings for UPPER and lower mix', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Order: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['SHIPPED', 'delivered', 'PENDING'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: expect.stringMatching(/inconsistent/i),
    });
  });
});

test('aep-126-enum-case-consistent should find no warnings for consistent UPPERCASE', () => {
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
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('aep-126-enum-case-consistent should find no warnings for consistent lowercase', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['draft', 'published', 'archived'],
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

test('aep-126-enum-case-consistent should find no warnings for consistent kebab-case', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Resource: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['in-progress', 'not-started', 'completed'],
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

test('aep-126-enum-case-consistent should find no warnings for consistent UPPER_SNAKE_CASE', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Order: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['ORDER_PENDING', 'ORDER_SHIPPED', 'ORDER_DELIVERED'],
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

test('aep-126-enum-case-consistent should ignore null values when checking consistency', () => {
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

test('aep-126-enum-case-consistent should not flag single-value enums', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Singleton: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['CONSTANT'],
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

const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0126', 'aep-126-enum-case-consistent');
  return linter;
});

test('aep-126-enum-case-consistent should pass for all UPPER case values', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN', 'CLOSED', 'PENDING'],
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

test('aep-126-enum-case-consistent should pass for all UPPER_SNAKE_CASE values', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN_NOW', 'CLOSED_TODAY', 'PENDING_REVIEW'],
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

test('aep-126-enum-case-consistent should pass for all UPPER-KEBAB-CASE values', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN-NOW', 'CLOSED-TODAY', 'PENDING-REVIEW'],
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

test('aep-126-enum-case-consistent should pass for all lower case values', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['open', 'closed', 'pending'],
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

test('aep-126-enum-case-consistent should pass for all snake_case values', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['open_now', 'closed_today', 'pending_review'],
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

test('aep-126-enum-case-consistent should pass for all kebab-case values', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['open-now', 'closed-today', 'pending-review'],
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

test('aep-126-enum-case-consistent should pass for all PascalCase values', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OpenNow', 'ClosedToday', 'PendingReview'],
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

test('aep-126-enum-case-consistent should pass for all camelCase values', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['openNow', 'closedToday', 'pendingReview'],
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

test('aep-126-enum-case-consistent should pass for UPPER + UPPER_SNAKE combination', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN', 'CLOSED_NOW', 'PENDING_REVIEW'],
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

test('aep-126-enum-case-consistent should pass for UPPER + UPPER-KEBAB combination', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN', 'CLOSED-NOW', 'PENDING-REVIEW'],
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

test('aep-126-enum-case-consistent should pass for lower + snake_case combination', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['open', 'closed_now', 'pending_review'],
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

test('aep-126-enum-case-consistent should pass for lower + kebab-case combination', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['open', 'closed-now', 'pending-review'],
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

test('aep-126-enum-case-consistent should pass for lower + camelCase combination', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['open', 'closedNow', 'pendingReview'],
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

test('aep-126-enum-case-consistent should pass with null at start', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              nullable: true,
              enum: [null, 'OPEN', 'CLOSED'],
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

test('aep-126-enum-case-consistent should pass with null in middle', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              nullable: true,
              enum: ['OPEN', null, 'CLOSED'],
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

test('aep-126-enum-case-consistent should pass with null at end', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              nullable: true,
              enum: ['OPEN', 'CLOSED', null],
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

test('aep-126-enum-case-consistent should pass with multiple nulls', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              nullable: true,
              enum: [null, 'OPEN', null, 'CLOSED', null],
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

test('aep-126-enum-case-consistent should pass for single value enum', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN'],
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

test('aep-126-enum-case-consistent should pass for non-string type field', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            priority: {
              type: 'integer',
              enum: [1, 2, 3],
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

test('aep-126-enum-case-consistent should pass for empty enum array', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: [],
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

test('aep-126-enum-case-consistent should pass when only one string value with nulls', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              nullable: true,
              enum: [null, 'OPEN', null],
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

test('aep-126-enum-case-consistent should pass for field without enum property', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
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

test('aep-126-enum-case-consistent should fail for UPPER + lower combination', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN', 'closed', 'PENDING'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      message: expect.stringMatching(/inconsistent case styles/i),
    });
  });
});

test('aep-126-enum-case-consistent should fail for UPPER + PascalCase combination', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN', 'Closed', 'Pending'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      message: expect.stringMatching(/inconsistent case styles/i),
    });
  });
});

test('aep-126-enum-case-consistent should fail for UPPER + camelCase combination', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN', 'closedNow', 'pending'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      message: expect.stringMatching(/inconsistent case styles/i),
    });
  });
});

test('aep-126-enum-case-consistent should fail for UPPER_SNAKE + snake_case combination', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN_NOW', 'closed_now', 'PENDING'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      message: expect.stringMatching(/inconsistent case styles/i),
    });
  });
});

test('aep-126-enum-case-consistent should fail for UPPER-KEBAB + kebab-case combination', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN-NOW', 'closed-now', 'PENDING'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      message: expect.stringMatching(/inconsistent case styles/i),
    });
  });
});

test('aep-126-enum-case-consistent should fail for PascalCase + camelCase combination', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OpenNow', 'closedNow', 'PendingReview'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      message: expect.stringMatching(/inconsistent case styles/i),
    });
  });
});

test('aep-126-enum-case-consistent should fail for snake_case + kebab-case combination', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['open_now', 'closed-now', 'pending'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      message: expect.stringMatching(/inconsistent case styles/i),
    });
  });
});

test('aep-126-enum-case-consistent should fail for snake_case + camelCase combination', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['open_now', 'closedNow', 'pending'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      message: expect.stringMatching(/inconsistent case styles/i),
    });
  });
});

test('aep-126-enum-case-consistent should fail for UPPER_SNAKE + kebab-case combination', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN_NOW', 'closed-now'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      message: expect.stringMatching(/inconsistent case styles/i),
    });
  });
});

test('aep-126-enum-case-consistent should fail for UPPER-KEBAB + snake_case combination', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN-NOW', 'closed_now'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      message: expect.stringMatching(/inconsistent case styles/i),
    });
  });
});

test('aep-126-enum-case-consistent should fail for PascalCase + snake_case combination', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OpenNow', 'closed_now'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      message: expect.stringMatching(/inconsistent case styles/i),
    });
  });
});

test('aep-126-enum-case-consistent should fail for three or more inconsistent styles', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN', 'closed', 'PendingReview', 'in_progress'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      message: expect.stringMatching(/inconsistent case styles/i),
    });
  });
});

test('aep-126-enum-case-consistent should include field name in error message', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN', 'closed'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].message).toMatch(/field "state"/i);
  });
});

test('aep-126-enum-case-consistent should show case styles for each value', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN', 'closed', 'Pending'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].message).toMatch(/"OPEN"/);
    expect(results[0].message).toMatch(/"closed"/);
    expect(results[0].message).toMatch(/\(UPPER\)/);
    expect(results[0].message).toMatch(/\(lower\)/);
  });
});

test('aep-126-enum-case-consistent should truncate to first 3 examples with ellipsis', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN', 'closed', 'Pending', 'in_review', 'Done'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].message).toMatch(/\.\.\./);
    const quoteCount = (results[0].message.match(/"/g) || []).length;
    expect(quoteCount).toBe(8); // field name + 3 values × 2 quotes each
  });
});

test('aep-126-enum-case-consistent should handle single character values consistently', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Grade: {
          type: 'object',
          properties: {
            letter: {
              type: 'string',
              enum: ['A', 'B', 'C'],
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

test('aep-126-enum-case-consistent should handle numeric strings consistently', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Priority: {
          type: 'object',
          properties: {
            level: {
              type: 'string',
              enum: ['1', '2', '3'],
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

test('aep-126-enum-case-consistent should fail for empty string in enum', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN', '', 'CLOSED'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].message).toMatch(/unknown case styles/i);
    expect(results[0].message).toMatch(/""/);
  });
});

test('aep-126-enum-case-consistent should fail for enum with non-string values', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Status: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              enum: ['OPEN', 123, 'CLOSED'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].message).toMatch(/unknown case styles/i);
    expect(results[0].message).toMatch(/"123"/);
  });
});

test('aep-126-enum-case-consistent should not fail for operation parameter with enum', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/books': {
        get: {
          parameters: [
            {
              name: 'status',
              in: 'query',
              schema: {
                type: 'string',
                enum: ['PUBLISHED', 'DRAFT', 'ARCHIVED'],
              },
            },
          ],
          responses: {
            200: {
              description: 'Success',
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

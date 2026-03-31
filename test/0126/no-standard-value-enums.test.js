const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0126', 'aep-126-no-standard-value-enums');
  return linter;
});

test('aep-126-no-standard-value-enums should warn for language field', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              enum: ['EN', 'FR', 'ES', 'DE'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: expect.stringMatching(/standard codes/i),
    });
  });
});

test('aep-126-no-standard-value-enums should warn for language_code field', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Document: {
          type: 'object',
          properties: {
            language_code: {
              type: 'string',
              enum: ['en', 'fr', 'es'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: expect.stringMatching(/standard/i),
    });
  });
});

test('aep-126-no-standard-value-enums should warn for country field', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Address: {
          type: 'object',
          properties: {
            country: {
              type: 'string',
              enum: ['US', 'CA', 'MX'],
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: expect.stringMatching(/standard/i),
    });
  });
});

test('aep-126-no-standard-value-enums should warn for country_code field', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Location: {
          type: 'object',
          properties: {
            country_code: {
              type: 'string',
              enum: ['USA', 'CAN', 'MEX'],
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

test('aep-126-no-standard-value-enums should warn for region_code field', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Service: {
          type: 'object',
          properties: {
            region_code: {
              type: 'string',
              enum: ['us-east', 'us-west', 'eu-central'],
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

test('aep-126-no-standard-value-enums should warn for currency field', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Payment: {
          type: 'object',
          properties: {
            currency: {
              type: 'string',
              enum: ['USD', 'EUR', 'GBP'],
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

test('aep-126-no-standard-value-enums should warn for currency_code field', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Transaction: {
          type: 'object',
          properties: {
            currency_code: {
              type: 'string',
              enum: ['USD', 'EUR'],
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

test('aep-126-no-standard-value-enums should warn for media_type field', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        File: {
          type: 'object',
          properties: {
            media_type: {
              type: 'string',
              enum: ['image/jpeg', 'image/png', 'application/pdf'],
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

test('aep-126-no-standard-value-enums should warn for content_type field', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Document: {
          type: 'object',
          properties: {
            content_type: {
              type: 'string',
              enum: ['text/html', 'application/json'],
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

test('aep-126-no-standard-value-enums should not warn for other enum fields', () => {
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
            format: {
              type: 'string',
              enum: ['HARDCOVER', 'PAPERBACK', 'EBOOK'],
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
    expect(results.length).toBe(0);
  });
});

const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0122', 'aep-122-resource-id-type');
  return linter;
});

test('aep-122-resource-id-type should find errors when id fields are not strings', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          'x-aep-resource': true,
          type: 'object',
          properties: {
            path: {
              type: 'string',
            },
            id: {
              type: 'integer',
            },
            publisher_id: {
              type: 'number',
            },
          },
          required: ['path'],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Book', 'properties', 'id', 'type'],
      message: "Resource ID fields (ending in '_id' or named 'id') must be of type 'string'",
    });
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Book', 'properties', 'publisher_id', 'type'],
      message: "Resource ID fields (ending in '_id' or named 'id') must be of type 'string'",
    });
  });
});

test('aep-122-resource-id-type should find no errors when id fields are strings', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          'x-aep-resource': true,
          type: 'object',
          properties: {
            path: {
              type: 'string',
            },
            id: {
              type: 'string',
            },
            publisher_id: {
              type: 'string',
            },
            author_id: {
              type: 'string',
            },
          },
          required: ['path'],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('aep-122-resource-id-type should not flag non-id fields', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          'x-aep-resource': true,
          type: 'object',
          properties: {
            path: {
              type: 'string',
            },
            page_count: {
              type: 'integer',
            },
            price: {
              type: 'number',
            },
          },
          required: ['path'],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

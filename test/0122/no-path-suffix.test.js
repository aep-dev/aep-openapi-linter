const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0122', 'aep-122-no-path-suffix');
  return linter;
});

test('aep-122-no-path-suffix should find warnings for _path suffix in AEP resources', () => {
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
            name: {
              type: 'string',
            },
            author_path: {
              type: 'string',
            },
            publisher_path: {
              type: 'string',
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
      path: ['components', 'schemas', 'Book', 'properties', 'author_path'],
      message:
        "Avoid using '_path' suffix in field names; use the field name directly (e.g., 'book' instead of 'book_path')",
    });
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Book', 'properties', 'publisher_path'],
      message:
        "Avoid using '_path' suffix in field names; use the field name directly (e.g., 'book' instead of 'book_path')",
    });
  });
});

test('aep-122-no-path-suffix should find no warnings without _path suffix', () => {
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
            name: {
              type: 'string',
            },
            author: {
              type: 'string',
            },
            publisher: {
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

test('aep-122-no-path-suffix should not flag non-AEP resources with _path suffix', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        FileInfo: {
          type: 'object',
          properties: {
            file_path: {
              type: 'string',
              description: 'Legitimate file path field in non-AEP schema',
            },
            directory_path: {
              type: 'string',
            },
          },
        },
        Book: {
          'x-aep-resource': true,
          type: 'object',
          properties: {
            path: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
          },
          required: ['path'],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    // FileInfo should NOT trigger warnings, only AEP resources are checked
    expect(results.length).toBe(0);
  });
});

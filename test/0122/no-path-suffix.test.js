const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0122', 'aep-122-no-path-suffix');
  return linter;
});

test('aep-122-no-path-suffix should find warnings for _path suffix', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
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
            file_path: {
              type: 'string',
              description: 'File path is acceptable as it needs disambiguation',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    // file_path will trigger a warning, but 'path' should not
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Book', 'properties', 'file_path'],
    });
  });
});

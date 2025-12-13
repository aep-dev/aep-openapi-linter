const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0004', 'aep-0004-x-aep-resource-structure');
  return linter;
});

test('aep-0004-x-aep-resource-structure should find errors for missing required fields', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Publisher: {
          type: 'object',
          'x-aep-resource': {
            plural: 'publishers',
            // missing 'singular' field
          },
        },
        Author: {
          type: 'object',
          'x-aep-resource': {
            singular: 'author',
            // missing 'plural' field
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Publisher', 'x-aep-resource'],
      message: 'The x-aep-resource extension does not conform to AEP-4 requirements',
    });
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Author', 'x-aep-resource'],
    });
  });
});

test('aep-0004-x-aep-resource-structure should find errors for invalid field formats', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Author: {
          type: 'object',
          'x-aep-resource': {
            type: 'book-store.example.com/author',
            singular: 'Author', // should be kebab-case lowercase
            plural: 'authors',
            patterns: ['authors/{author_id}'],
          },
        },
        Magazine: {
          type: 'object',
          'x-aep-resource': {
            type: 'book-store.example.com/magazine',
            singular: 'magazine',
            plural: 'Magazines', // should be kebab-case lowercase
            patterns: ['magazines/{magazine_id}'],
          },
        },
        BookStore: {
          type: 'object',
          'x-aep-resource': {
            type: 'book-store.example.com/book-store',
            singular: 'book_store', // should use hyphens not underscores
            plural: 'book-stores',
            patterns: ['book-stores/{book_store_id}'],
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Author', 'x-aep-resource', 'singular'],
    });
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Magazine', 'x-aep-resource', 'plural'],
    });
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'BookStore', 'x-aep-resource', 'singular'],
    });
  });
});

test('aep-0004-x-aep-resource-structure should find no errors for valid minimal structure', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          'x-aep-resource': {
            type: 'book-store.example.com/book',
            singular: 'book',
            plural: 'books',
            patterns: ['books/{book_id}'],
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('aep-0004-x-aep-resource-structure should find no errors for valid complete structure', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          'x-aep-resource': {
            type: 'book-store.example.com/book',
            singular: 'book',
            plural: 'books',
            patterns: ['publishers/{publisher_id}/books/{book_id}'],
            parents: ['publisher'],
          },
        },
        Publisher: {
          type: 'object',
          'x-aep-resource': {
            type: 'book-store.example.com/publisher',
            singular: 'publisher',
            plural: 'publishers',
            patterns: ['publishers/{publisher_id}'],
          },
        },
        Library: {
          type: 'object',
          'x-aep-resource': {
            type: 'book-store.example.com/library',
            singular: 'library',
            plural: 'libraries',
            patterns: ['library'],
            singleton: true,
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('aep-0004-x-aep-resource-structure should allow kebab-case in singular and plural names', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        BookEdition: {
          type: 'object',
          'x-aep-resource': {
            type: 'book-store.example.com/book-edition',
            singular: 'book-edition',
            plural: 'book-editions',
            patterns: ['book-editions/{book_edition_id}'],
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('aep-0004-x-aep-resource-structure should find error for missing patterns field', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          'x-aep-resource': {
            type: 'book-store.example.com/book',
            singular: 'book',
            plural: 'books',
            // missing 'patterns' field
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Book', 'x-aep-resource'],
      message: 'The x-aep-resource extension does not conform to AEP-4 requirements',
    });
  });
});

test('aep-0004-x-aep-resource-structure should find error for empty patterns array', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          'x-aep-resource': {
            type: 'book-store.example.com/book',
            singular: 'book',
            plural: 'books',
            patterns: [], // empty array
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Book', 'x-aep-resource', 'patterns'],
    });
  });
});

test('aep-0004-x-aep-resource-structure should find error for invalid pattern format', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          'x-aep-resource': {
            type: 'book-store.example.com/book',
            singular: 'book',
            plural: 'books',
            patterns: [
              'books/{book_id}', // valid
              'Books/{book_id}', // invalid - starts with uppercase
              'books/{Book_id}', // invalid - parameter has uppercase
              'books/{book-id}/chapters/{chapter_id}/pages/{Page_id}', // invalid - parameter has uppercase
            ],
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBeGreaterThan(0);
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Book', 'x-aep-resource', 'patterns', '1'],
    });
  });
});

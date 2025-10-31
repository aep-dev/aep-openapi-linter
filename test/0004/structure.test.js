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
            singular: 'Author', // should be kebab-case lowercase
            plural: 'authors',
          },
        },
        Magazine: {
          type: 'object',
          'x-aep-resource': {
            singular: 'magazine',
            plural: 'Magazines', // should be kebab-case lowercase
          },
        },
        BookStore: {
          type: 'object',
          'x-aep-resource': {
            singular: 'book_store', // should use hyphens not underscores
            plural: 'book-stores',
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
            singular: 'book',
            plural: 'books',
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
            singular: 'book',
            plural: 'books',
            patterns: ['publishers/{publisher_id}/books/{book_id}'],
            parents: ['publisher'],
          },
        },
        Publisher: {
          type: 'object',
          'x-aep-resource': {
            singular: 'publisher',
            plural: 'publishers',
            patterns: ['publishers/{publisher_id}'],
          },
        },
        Library: {
          type: 'object',
          'x-aep-resource': {
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
            singular: 'book-edition',
            plural: 'book-editions',
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

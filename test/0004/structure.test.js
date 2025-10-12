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
        Book: {
          type: 'object',
          'x-aep-resource': {
            singular: 'book',
            plural: 'books',
            // missing 'type' field
          },
        },
        Publisher: {
          type: 'object',
          'x-aep-resource': {
            type: 'library.example.com/Publisher',
            plural: 'publishers',
            // missing 'singular' field
          },
        },
        Author: {
          type: 'object',
          'x-aep-resource': {
            type: 'library.example.com/Author',
            singular: 'author',
            // missing 'plural' field
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Book', 'x-aep-resource'],
      message: 'The x-aep-resource extension does not conform to AEP-4 requirements',
    });
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Publisher', 'x-aep-resource'],
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
        Book: {
          type: 'object',
          'x-aep-resource': {
            type: 'InvalidType', // missing API name
            singular: 'book',
            plural: 'books',
          },
        },
        Publisher: {
          type: 'object',
          'x-aep-resource': {
            type: 'library.example.com/publisher', // type name should be UpperCamelCase
            singular: 'publisher',
            plural: 'publishers',
          },
        },
        Author: {
          type: 'object',
          'x-aep-resource': {
            type: 'library.example.com/Author',
            singular: 'Author', // should be kebab-case lowercase
            plural: 'authors',
          },
        },
        Magazine: {
          type: 'object',
          'x-aep-resource': {
            type: 'library.example.com/Magazine',
            singular: 'magazine',
            plural: 'Magazines', // should be kebab-case lowercase
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(4);
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Book', 'x-aep-resource', 'type'],
    });
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Publisher', 'x-aep-resource', 'type'],
    });
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Author', 'x-aep-resource', 'singular'],
    });
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Magazine', 'x-aep-resource', 'plural'],
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
            type: 'library.example.com/Book',
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
            type: 'library.example.com/Book',
            singular: 'book',
            plural: 'books',
            patterns: ['publishers/{publisher_id}/books/{book_id}'],
            parents: ['publisher'],
          },
        },
        Publisher: {
          type: 'object',
          'x-aep-resource': {
            type: 'library.example.com/Publisher',
            singular: 'publisher',
            plural: 'publishers',
            patterns: ['publishers/{publisher_id}'],
          },
        },
        Library: {
          type: 'object',
          'x-aep-resource': {
            type: 'library.example.com/Library',
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

test('aep-0004-x-aep-resource-structure should allow kebab-case in type names', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        BookEdition: {
          type: 'object',
          'x-aep-resource': {
            type: 'library.example.com/BookEdition',
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

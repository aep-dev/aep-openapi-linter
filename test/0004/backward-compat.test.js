const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0004', 'aep-0004-x-aep-resource-structure');
  return linter;
});

test('aep-0004-x-aep-resource-structure should allow boolean marker (backward compatibility)', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          'x-aep-resource': true, // Boolean marker for backward compatibility
        },
        Publisher: {
          type: 'object',
          'x-aep-resource': true,
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('aep-0004-x-aep-resource-structure should not validate schemas without x-aep-resource', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          type: 'object',
          // No x-aep-resource extension
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
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

test('aep-0004-x-aep-resource-structure should validate mixed scenarios', () => {
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
        Publisher: {
          type: 'object',
          'x-aep-resource': true, // Boolean marker - should pass
        },
        Author: {
          type: 'object',
          'x-aep-resource': {
            singular: 'author',
            // Missing 'plural' - should fail
          },
        },
        ErrorResponse: {
          type: 'object',
          // No x-aep-resource - should not be validated
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      path: ['components', 'schemas', 'Author', 'x-aep-resource'],
      message: 'The x-aep-resource extension does not conform to AEP-4 requirements',
    });
  });
});

const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0122', 'aep-122-no-self-links');
});

test('aep-122-no-self-links should find errors when resource has self_link field', () => {
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
              description: 'The resource path of the book',
            },
            name: {
              type: 'string',
            },
            self_link: {
              type: 'string',
              description: 'Self link to the resource',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: "Resources must not contain a 'self_link' field; use 'path' instead",
    });
  });
});

test('aep-122-no-self-links should find no errors when resource has no self_link field', () => {
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
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('aep-122-no-self-links should not check non-resource schemas', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        BookMetadata: {
          // Not marked as x-aep-resource
          type: 'object',
          properties: {
            self_link: {
              type: 'string',
              description: 'Some other self_link field',
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

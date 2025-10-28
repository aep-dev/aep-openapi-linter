const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0122', 'aep-122-resource-path-field');
});

test('aep-122-resource-path-field should find errors when path field is missing', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          'x-aep-resource': true,
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: "Resource schema must include a 'path' property of type 'string'",
    });
  });
});

test('aep-122-resource-path-field should find errors when path field is not a string', () => {
  const oasDoc = {
    openapi: '3.0.3',
    components: {
      schemas: {
        Book: {
          'x-aep-resource': true,
          type: 'object',
          properties: {
            path: {
              type: 'integer',
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: "Resource schema must include a 'path' property of type 'string'",
    });
  });
});

test('aep-122-resource-path-field should find no errors when path field is correctly defined', () => {
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
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

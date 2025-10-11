const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0122', 'aep-122-path-field-required');
  return linter;
});

test('aep-122-path-field-required should find errors when path is not in required array', () => {
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
          required: ['name'],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: "The 'path' field must be listed in the 'required' array",
    });
  });
});

test('aep-122-path-field-required should find errors when required array is missing', () => {
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
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: "The 'path' field must be listed in the 'required' array",
    });
  });
});

test('aep-122-path-field-required should find no errors when path is in required array', () => {
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
          required: ['path', 'name'],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

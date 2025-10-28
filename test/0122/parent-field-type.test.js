const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0122', 'aep-122-parent-field-type');
});

test('aep-122-parent-field-type should find errors when parent is not a string', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/books': {
        get: {
          operationId: 'ListBooks',
          parameters: [
            {
              name: 'parent',
              in: 'query',
              schema: {
                type: 'integer',
              },
            },
          ],
        },
      },
      '/publishers': {
        parameters: [
          {
            name: 'parent',
            in: 'query',
            schema: {
              type: 'object',
            },
          },
        ],
      },
    },
    components: {
      parameters: {
        ParentParam: {
          name: 'parent',
          in: 'query',
          schema: {
            type: 'array',
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(3);
    expect(results).toContainMatch({
      message: "The 'parent' parameter must be of type 'string'",
    });
  });
});

test('aep-122-parent-field-type should find errors when parent has no type', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/books': {
        get: {
          operationId: 'ListBooks',
          parameters: [
            {
              name: 'parent',
              in: 'query',
              schema: {
                // Missing 'type' field
                description: 'The parent resource',
              },
            },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      message: "The 'parent' parameter must be of type 'string'",
    });
  });
});

test('aep-122-parent-field-type should find no errors when parent is a string', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/books': {
        get: {
          operationId: 'ListBooks',
          parameters: [
            {
              name: 'parent',
              in: 'query',
              schema: {
                type: 'string',
              },
            },
          ],
        },
      },
    },
    components: {
      parameters: {
        ParentParam: {
          name: 'parent',
          in: 'query',
          schema: {
            type: 'string',
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

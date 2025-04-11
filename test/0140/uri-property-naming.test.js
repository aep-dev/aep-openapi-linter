const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0140', 'aep-140-uri-property-naming');
  return linter;
});

test('aep-140-uri-property-naming should find warnings', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      url: {
                        type: 'string',
                      },
                      extra_url: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results).toContainMatch({
      path: [
        'paths',
        '/test1',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'url',
      ],
      message: 'Properties representing URLs or URIs should be named "uri" rather than "url".',
    });
    expect(results).toContainMatch({
      path: [
        'paths',
        '/test1',
        'get',
        'responses',
        '200',
        'content',
        'application/json',
        'schema',
        'properties',
        'extra_url',
      ],
      message: 'Properties representing URLs or URIs should be named "uri" rather than "url".',
    });
  });
});

test('aep-140-uri-property-naming should find no warnings', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      uri: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
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

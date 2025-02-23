const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0158', 'aep-158-skip-parameter');
  return linter;
});

test('aep-158-skip-parameter should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          description: 'skip parameter is not an integer',
          parameters: [
            {
              name: 'skip',
              in: 'query',
              schema: {
                type: 'string',
              },
            },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    const message = 'The skip parameter must be an integer.';
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'get', 'parameters', '0', 'schema', 'type'],
      message,
    });
  });
});

test('aep-158-skip-parameter should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          parameters: [
            {
              name: 'skip',
              in: 'query',
              schema: {
                type: 'integer',
              },
            },
          ],
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

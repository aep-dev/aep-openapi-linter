const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0158', 'aep-158-page-token-parameter-optional');
  return linter;
});

test('aep-158-page-token-parameter-optional should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          description: 'page_token parameter is required',
          parameters: [
            {
              name: 'page_token',
              in: 'query',
              required: true,
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
    const message = 'The page_token parameter must not be required.';
    expect(results).toContainMatch({
      path: ['paths', '/test1', 'get', 'parameters', '0', 'required'],
      message,
    });
  });
});

test('aep-158-page-token-parameter-optional should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          parameters: [
            {
              name: 'page_token',
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
    expect(results.length).toBe(0);
  });
});

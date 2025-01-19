const { linterForAepRule } = require('../utils');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0132', 'aep-132-operation-id');
  return linter;
});

test('aep-132-operation-id should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          responses: {
            200: {
              description: 'Ok',
            },
          },
        },
      },
      '/test2': {
        get: {
          operationId: 'random',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    const paths = results.map(({ path }) => path.join('.'));
    expect(paths).toContain('paths./test1.get');
    expect(paths).toContain('paths./test2.get.operationId');
  });
});

test('aep-132-operation-id should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        get: {
          operationId: 'listTest',
        },
      },
      '/test2': {
        get: {
          operationId: 'ListTest',
        },
      },
      '/test3/{id}': {
        get: {
          operationId: 'GetTest',
        },
      },
      '/test4:fetch': {
        get: {
          operationId: ':fetch',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

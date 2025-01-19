const { linterForAepRule } = require('../utils');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0135', 'aep-135-operation-id');
  return linter;
});

test('aep-135-operation-id should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        delete: {
          responses: {
            200: {
              description: 'Ok',
            },
          },
        },
      },
      '/test2/{id}': {
        delete: {
          operationId: 'random',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    const paths = results.map(({ path }) => path.join('.'));
    expect(paths).toContain('paths./test1/{id}.delete');
    expect(paths).toContain('paths./test2/{id}.delete.operationId');
  });
});

test('aep-135-operation-id should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1/{id}': {
        delete: {
          operationId: 'deleteTest',
        },
      },
      '/test2/{id}': {
        delete: {
          operationId: 'DeleteTest',
        },
      },
      '/test3/{id}:clear': {
        delete: {
          operationId: ':clear',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

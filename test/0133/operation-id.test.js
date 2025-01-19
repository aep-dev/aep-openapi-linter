const { linterForAepRule } = require('../utils');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0133', 'aep-133-operation-id');
  return linter;
});

test('aep-133-operation-id should find errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        post: {
          responses: {
            200: {
              description: 'Ok',
            },
          },
        },
      },
      '/test2': {
        post: {
          operationId: 'random',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    const paths = results.map(({ path }) => path.join('.'));
    expect(paths).toContain('paths./test1.post');
    expect(paths).toContain('paths./test2.post.operationId');
  });
});

test('aep-133-operation-id should find no errors', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test1': {
        post: {
          operationId: 'createTest',
        },
      },
      '/test2': {
        post: {
          operationId: 'CreateTest',
        },
      },
      '/test3/{id}': {
        post: {
          operationId: 'whatever',
        },
      },
      '/test4:deploy': {
        post: {
          operationId: ':deploy',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

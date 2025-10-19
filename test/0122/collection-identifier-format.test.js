const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0122', 'aep-122-collection-identifier-format');
  return linter;
});

test('aep-122-collection-identifier-format should find errors when not starting with lowercase letter', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/1books/{book}': {
        get: {
          operationId: 'GetBook',
        },
      },
      '/-books/{book}': {
        get: {
          operationId: 'GetBook2',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results).toContainMatch({
      path: ['paths', '/1books/{book}'],
      message: 'Collection identifiers must match the pattern /[a-z][a-z0-9-]*/',
    });
    expect(results).toContainMatch({
      path: ['paths', '/-books/{book}'],
      message: 'Collection identifiers must match the pattern /[a-z][a-z0-9-]*/',
    });
  });
});

test('aep-122-collection-identifier-format should find errors with uppercase letters', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/Books/{book}': {
        get: {
          operationId: 'GetBook',
        },
      },
      '/electronicBooks/{book}': {
        get: {
          operationId: 'GetElectronicBook',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
  });
});

test('aep-122-collection-identifier-format should find no errors with valid format', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/books/{book}': {
        get: {
          operationId: 'GetBook',
        },
      },
      '/electronic-books/{book}': {
        get: {
          operationId: 'GetElectronicBook',
        },
      },
      '/api-keys/{key}': {
        get: {
          operationId: 'GetApiKey',
        },
      },
      '/users/{user}/books2/{book}': {
        get: {
          operationId: 'GetBook',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('aep-122-collection-identifier-format should handle deeply nested resources', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/publishers/{publisher}/books/{book}/chapters/{chapter}': {
        get: {
          operationId: 'GetChapter',
        },
      },
      '/orgs/{org}/projects/{project}/datasets/{dataset}/tables/{table}': {
        get: {
          operationId: 'GetTable',
        },
      },
      '/a/{a}/b/{b}/c/{c}/d/{d}/e/{e}': {
        get: {
          operationId: 'GetE',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

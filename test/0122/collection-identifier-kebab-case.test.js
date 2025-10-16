const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0122', 'aep-122-collection-identifier-kebab-case');
  return linter;
});

test('aep-122-collection-identifier-kebab-case should find errors with camelCase', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/publishers/{publisher}/electronicBooks/{book}': {
        get: {
          operationId: 'GetBook',
        },
      },
      '/userProfiles/{profile}': {
        get: {
          operationId: 'GetUserProfile',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    const expectedMessage =
      "Collection identifiers must be in kebab-case (e.g., 'electronic-books', " +
      "not 'electronicBooks' or 'electronic_books')";
    expect(results.length).toBe(2);
    expect(results).toContainMatch({
      path: ['paths', '/publishers/{publisher}/electronicBooks/{book}'],
      message: expectedMessage,
    });
    expect(results).toContainMatch({
      path: ['paths', '/userProfiles/{profile}'],
      message: expectedMessage,
    });
  });
});

test('aep-122-collection-identifier-kebab-case should find errors with snake_case', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/electronic_books/{book}': {
        get: {
          operationId: 'GetBook',
        },
      },
      '/user_profiles/{profile}': {
        get: {
          operationId: 'GetUserProfile',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results).toContainMatch({
      path: ['paths', '/electronic_books/{book}'],
    });
    expect(results).toContainMatch({
      path: ['paths', '/user_profiles/{profile}'],
    });
  });
});

test('aep-122-collection-identifier-kebab-case should find errors with PascalCase', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/Publishers/{publisher}/Books/{book}': {
        get: {
          operationId: 'GetBook',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      path: ['paths', '/Publishers/{publisher}/Books/{book}'],
    });
  });
});

test('aep-122-collection-identifier-kebab-case should find no errors with kebab-case', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/publishers/{publisher}/books/{book}': {
        get: {
          operationId: 'GetBook',
        },
      },
      '/electronic-books/{book}': {
        get: {
          operationId: 'GetElectronicBook',
        },
      },
      '/user-profiles/{profile}': {
        get: {
          operationId: 'GetUserProfile',
        },
      },
      '/users/{user}/api-keys/{key}': {
        get: {
          operationId: 'GetApiKey',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('aep-122-collection-identifier-kebab-case should allow single word collections', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/books/{book}': {
        get: {
          operationId: 'GetBook',
        },
      },
      '/users/{user}': {
        get: {
          operationId: 'GetUser',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

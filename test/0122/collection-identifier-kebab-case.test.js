const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0122', 'aep-122-collection-identifier-kebab-case');
});

test('aep-122-collection-identifier-kebab-case should find errors with camelCase', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/publishers/{publisher_id}/electronicBooks/{book_id}': {
        get: {
          operationId: 'GetBook',
        },
      },
      '/userProfiles/{profile_id}': {
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
      path: ['paths', '/publishers/{publisher_id}/electronicBooks/{book_id}'],
      message: expectedMessage,
    });
    expect(results).toContainMatch({
      path: ['paths', '/userProfiles/{profile_id}'],
      message: expectedMessage,
    });
  });
});

test('aep-122-collection-identifier-kebab-case should find errors with snake_case', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/electronic_books/{book_id}': {
        get: {
          operationId: 'GetBook',
        },
      },
      '/user_profiles/{profile_id}': {
        get: {
          operationId: 'GetUserProfile',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(2);
    expect(results).toContainMatch({
      path: ['paths', '/electronic_books/{book_id}'],
    });
    expect(results).toContainMatch({
      path: ['paths', '/user_profiles/{profile_id}'],
    });
  });
});

test('aep-122-collection-identifier-kebab-case should find errors with PascalCase', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/Publishers/{publisher_id}/Books/{book_id}': {
        get: {
          operationId: 'GetBook',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      path: ['paths', '/Publishers/{publisher_id}/Books/{book_id}'],
    });
  });
});

test('aep-122-collection-identifier-kebab-case should find no errors with kebab-case', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/publishers/{publisher_id}/books/{book_id}': {
        get: {
          operationId: 'GetBook',
        },
      },
      '/electronic-books/{book_id}': {
        get: {
          operationId: 'GetElectronicBook',
        },
      },
      '/user-profiles/{profile_id}': {
        get: {
          operationId: 'GetUserProfile',
        },
      },
      '/users/{user_id}/api-keys/{key_id}': {
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
      '/books/{book_id}': {
        get: {
          operationId: 'GetBook',
        },
      },
      '/users/{user_id}': {
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

test('aep-122-collection-identifier-kebab-case should allow underscores in path parameters', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/users/{user_id}': {
        get: {
          operationId: 'GetUser',
        },
      },
      '/publishers/{publisher_id}/books/{book_id}': {
        get: {
          operationId: 'GetBook',
        },
      },
      '/electronic-books/{electronic_book_id}/chapters/{chapter_id}': {
        get: {
          operationId: 'GetChapter',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

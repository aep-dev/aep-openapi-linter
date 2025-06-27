const { linterForAepRule } = require('../utils');
require('../matchers');

let linter;

beforeAll(async () => {
  linter = await linterForAepRule('0151', 'aep-151-operations-endpoint');
  return linter;
});

test('aep-151-operations-endpoint should find errors when operations endpoint is missing', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        post: {
          responses: {
            '202': {
              description: 'Accepted',
            },
          },
        },
      },
      // Missing /v1/operations and /v1/operations/{operation} endpoints
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      path: ['paths'],
      message: 'Services with long-running operations must define an operations endpoint with list and get operations',
    });
  });
});

test('aep-151-operations-endpoint should find errors when operations list endpoint is missing', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        post: {
          responses: {
            '202': {
              description: 'Accepted',
            },
          },
        },
      },
      '/v1/operations/{operation}': {
        get: {
          description: 'Get operation',
        },
      },
      // Missing /v1/operations endpoint
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      path: ['paths'],
      message: 'Services with long-running operations must define an operations endpoint with list and get operations',
    });
  });
});

test('aep-151-operations-endpoint should find errors when operations get endpoint is missing', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        post: {
          responses: {
            '202': {
              description: 'Accepted',
            },
          },
        },
      },
      '/v1/operations': {
        get: {
          description: 'List operations',
        },
      },
      // Missing /v1/operations/{operation} endpoint
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1);
    expect(results).toContainMatch({
      path: ['paths'],
      message: 'Services with long-running operations must define an operations endpoint with list and get operations',
    });
  });
});

test('aep-151-operations-endpoint should find no errors with valid operations endpoints', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        post: {
          responses: {
            '202': {
              description: 'Accepted',
            },
          },
        },
      },
      '/v1/operations': {
        get: {
          description: 'List operations',
        },
      },
      '/v1/operations/{operation}': {
        get: {
          description: 'Get operation',
        },
      },
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
});

test('aep-151-operations-endpoint should find no errors when no 202 response is present', () => {
  const oasDoc = {
    openapi: '3.0.3',
    paths: {
      '/test': {
        post: {
          responses: {
            '200': {
              description: 'OK',
            },
          },
        },
      },
      // No operations endpoints needed when no long-running operations
    },
  };
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0);
  });
}); 
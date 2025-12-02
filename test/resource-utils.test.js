const {
  resolveRef,
  hasAepResource,
  findResourceSchema,
  findResourceSchemaForCustomMethod,
  shouldLintOperation,
} = require('../functions/resource-utils');

describe('resolveRef', () => {
  const testDoc = {
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
        },
        Book: {
          type: 'object',
        },
      },
    },
  };

  test('should resolve a valid reference', () => {
    const result = resolveRef('#/components/schemas/User', testDoc);
    expect(result).toEqual({
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
    });
  });

  test('should return null for invalid reference', () => {
    expect(resolveRef('#/components/schemas/NonExistent', testDoc)).toBeNull();
  });

  test('should return null for non-reference strings', () => {
    expect(resolveRef('notAReference', testDoc)).toBeNull();
  });

  test('should return null for null input', () => {
    expect(resolveRef(null, testDoc)).toBeNull();
  });
});

describe('hasAepResource', () => {
  const testDoc = {
    components: {
      schemas: {
        User: {
          'x-aep-resource': 'example.com/User',
          type: 'object',
        },
        Book: {
          type: 'object',
        },
        UserList: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
      },
    },
  };

  test('should detect x-aep-resource on direct schema', () => {
    const schema = { 'x-aep-resource': 'example.com/User', type: 'object' };
    expect(hasAepResource(schema, testDoc)).toBe(true);
  });

  test('should detect x-aep-resource via $ref', () => {
    const schema = { $ref: '#/components/schemas/User' };
    expect(hasAepResource(schema, testDoc)).toBe(true);
  });

  test('should return false for schema without x-aep-resource', () => {
    const schema = { $ref: '#/components/schemas/Book' };
    expect(hasAepResource(schema, testDoc)).toBe(false);
  });

  test('should detect x-aep-resource in array items', () => {
    const schema = {
      type: 'array',
      items: {
        'x-aep-resource': 'example.com/User',
        type: 'object',
      },
    };
    expect(hasAepResource(schema, testDoc)).toBe(true);
  });

  test('should detect x-aep-resource in array items via $ref', () => {
    const schema = {
      type: 'array',
      items: {
        $ref: '#/components/schemas/User',
      },
    };
    expect(hasAepResource(schema, testDoc)).toBe(true);
  });

  test('should detect x-aep-resource in nested properties', () => {
    const schema = { $ref: '#/components/schemas/UserList' };
    expect(hasAepResource(schema, testDoc)).toBe(true);
  });

  test('should return false for null schema', () => {
    expect(hasAepResource(null, testDoc)).toBe(false);
  });
});

describe('findResourceSchema', () => {
  const testDoc = {
    components: {
      schemas: {
        User: {
          'x-aep-resource': 'example.com/User',
          type: 'object',
        },
      },
    },
  };

  test('should find schema in POST request body', () => {
    const operation = {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/User',
            },
          },
        },
      },
    };
    const result = findResourceSchema(operation, 'post', {}, testDoc);
    expect(result).toEqual({ $ref: '#/components/schemas/User' });
  });

  test('should find schema in PUT request body', () => {
    const operation = {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/User',
            },
          },
        },
      },
    };
    const result = findResourceSchema(operation, 'put', {}, testDoc);
    expect(result).toEqual({ $ref: '#/components/schemas/User' });
  });

  test('should find schema in PATCH request body', () => {
    const operation = {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/User',
            },
          },
        },
      },
    };
    const result = findResourceSchema(operation, 'patch', {}, testDoc);
    expect(result).toEqual({ $ref: '#/components/schemas/User' });
  });

  test('should find schema in GET 200 response', () => {
    const operation = {
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
      },
    };
    const result = findResourceSchema(operation, 'get', {}, testDoc);
    expect(result).toEqual({ $ref: '#/components/schemas/User' });
  });

  test('should find schema for DELETE via GET on same path', () => {
    const pathItem = {
      get: {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
        },
      },
      delete: {
        responses: {
          204: {
            description: 'Deleted',
          },
        },
      },
    };
    const result = findResourceSchema(
      pathItem.delete,
      'delete',
      pathItem,
      testDoc
    );
    expect(result).toEqual({ $ref: '#/components/schemas/User' });
  });

  test('should find schema for DELETE via POST if no GET exists', () => {
    const pathItem = {
      post: {
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
      },
      delete: {
        responses: {
          204: {
            description: 'Deleted',
          },
        },
      },
    };
    const result = findResourceSchema(
      pathItem.delete,
      'delete',
      pathItem,
      testDoc
    );
    expect(result).toEqual({ $ref: '#/components/schemas/User' });
  });

  test('should return null for operation without schema', () => {
    const operation = {
      responses: {
        204: {
          description: 'No content',
        },
      },
    };
    const result = findResourceSchema(operation, 'delete', {}, testDoc);
    expect(result).toBeNull();
  });
});

describe('findResourceSchemaForCustomMethod', () => {
  const testDoc = {
    paths: {
      '/users/{id}': {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
          },
        },
      },
      '/books/{id}': {
        post: {
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Book',
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        User: {
          'x-aep-resource': 'example.com/User',
        },
        Book: {
          'x-aep-resource': 'example.com/Book',
        },
      },
    },
  };

  test('should find resource schema by removing :action suffix', () => {
    const result = findResourceSchemaForCustomMethod(
      '/users/{id}:archive',
      testDoc.paths,
      testDoc
    );
    expect(result).toEqual({ $ref: '#/components/schemas/User' });
  });

  test('should find resource schema from POST if no GET', () => {
    const result = findResourceSchemaForCustomMethod(
      '/books/{id}:publish',
      testDoc.paths,
      testDoc
    );
    expect(result).toEqual({ $ref: '#/components/schemas/Book' });
  });

  test('should return null for non-custom-method path', () => {
    const result = findResourceSchemaForCustomMethod(
      '/users/{id}',
      testDoc.paths,
      testDoc
    );
    expect(result).toBeNull();
  });

  test('should return null if base path does not exist', () => {
    const result = findResourceSchemaForCustomMethod(
      '/nonexistent/{id}:action',
      testDoc.paths,
      testDoc
    );
    expect(result).toBeNull();
  });
});

describe('shouldLintOperation', () => {
  const testDoc = {
    paths: {
      '/users/{id}': {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User',
                  },
                },
              },
            },
          },
        },
        delete: {
          responses: {
            204: {
              description: 'Deleted',
            },
          },
        },
      },
      '/books/{id}': {
        get: {
          responses: {
            200: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Book',
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        User: {
          'x-aep-resource': 'example.com/User',
          type: 'object',
        },
        Book: {
          type: 'object',
        },
      },
    },
  };

  test('should return true for operation on resource with x-aep-resource', () => {
    const pathItem = testDoc.paths['/users/{id}'];
    const result = shouldLintOperation(
      pathItem.get,
      'get',
      '/users/{id}',
      pathItem,
      testDoc
    );
    expect(result).toBe(true);
  });

  test('should return false for operation on resource without x-aep-resource', () => {
    const pathItem = testDoc.paths['/books/{id}'];
    const result = shouldLintOperation(
      pathItem.get,
      'get',
      '/books/{id}',
      pathItem,
      testDoc
    );
    expect(result).toBe(false);
  });

  test('should return true for DELETE on resource with x-aep-resource', () => {
    const pathItem = testDoc.paths['/users/{id}'];
    const result = shouldLintOperation(
      pathItem.delete,
      'delete',
      '/users/{id}',
      pathItem,
      testDoc
    );
    expect(result).toBe(true);
  });

  test('should return true for custom method on resource with x-aep-resource', () => {
    const pathItem = {
      post: {
        // Custom method that doesn't reference a schema directly
        responses: {
          200: {
            description: 'Archived',
          },
        },
      },
    };
    const result = shouldLintOperation(
      pathItem.post,
      'post',
      '/users/{id}:archive',
      pathItem,
      testDoc
    );
    expect(result).toBe(true);
  });

  test('should return false for operation with no discoverable resource', () => {
    const operation = {
      responses: {
        200: {
          description: 'OK',
        },
      },
    };
    const result = shouldLintOperation(
      operation,
      'get',
      '/health',
      {},
      testDoc
    );
    expect(result).toBe(false);
  });
});

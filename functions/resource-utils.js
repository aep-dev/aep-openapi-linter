// Utility functions for finding and checking x-aep-resource annotations on schemas

/**
 * Resolves a JSON reference ($ref) to the actual object in the document
 * @param {string} ref - The $ref string (e.g., '#/components/schemas/User')
 * @param {object} document - The full OpenAPI document
 * @returns {object|null} The resolved object or null if not found
 */
function resolveRef(ref, document) {
  if (!ref || typeof ref !== 'string' || !ref.startsWith('#/')) {
    return null;
  }

  const parts = ref.substring(2).split('/'); // Remove '#/' and split
  let current = document;

  for (const part of parts) {
    if (!current || typeof current !== 'object') {
      return null;
    }
    current = current[part];
  }

  return current || null;
}

/**
 * Checks if a schema has the x-aep-resource extension, following $ref if needed
 * @param {object} schema - The schema object to check
 * @param {object} document - The full OpenAPI document for resolving references
 * @returns {boolean} True if the schema has x-aep-resource
 */
function hasAepResource(schema, document) {
  if (!schema || typeof schema !== 'object') {
    return false;
  }

  // If schema has $ref, resolve it first
  if (schema.$ref) {
    const resolved = resolveRef(schema.$ref, document);
    if (resolved) {
      return hasAepResource(resolved, document);
    }
    return false;
  }

  // Check for x-aep-resource on this schema
  if (schema['x-aep-resource']) {
    return true;
  }

  // For array types, check the items schema
  if (schema.type === 'array' && schema.items) {
    return hasAepResource(schema.items, document);
  }

  // For objects with properties that might contain arrays of resources
  // (e.g., list responses with a "users" property containing array of User)
  if (schema.properties) {
    for (const prop of Object.values(schema.properties)) {
      if (hasAepResource(prop, document)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Extracts the resource schema from an operation's request or response body
 * @param {object} operation - The operation object (get, post, etc.)
 * @param {string} method - The HTTP method
 * @param {object} pathItem - The path item containing this operation
 * @param {object} document - The full OpenAPI document
 * @returns {object|null} The resource schema or null if not found
 */
function findResourceSchema(operation, method, pathItem, document) {
  if (!operation || typeof operation !== 'object') {
    return null;
  }

  const lowerMethod = method.toLowerCase();

  // For POST, PUT, PATCH - check request body
  if (['post', 'put', 'patch'].includes(lowerMethod)) {
    const requestBody = operation.requestBody;
    if (requestBody?.content?.['application/json']?.schema) {
      return requestBody.content['application/json'].schema;
    }
  }

  // For GET - check 200 response body
  if (lowerMethod === 'get') {
    const response200 = operation.responses?.['200'];
    if (response200?.content?.['application/json']?.schema) {
      return response200.content['application/json'].schema;
    }
  }

  // For DELETE - look for GET on the same path
  if (lowerMethod === 'delete') {
    if (pathItem.get) {
      return findResourceSchema(pathItem.get, 'get', pathItem, document);
    }
    // Fallback: try other methods
    for (const m of ['post', 'put', 'patch']) {
      if (pathItem[m]) {
        return findResourceSchema(pathItem[m], m, pathItem, document);
      }
    }
  }

  return null;
}

/**
 * Finds the resource schema for a custom method (e.g., /users/{id}:archive)
 * by removing the :action suffix and looking for operations on the base path
 * @param {string} path - The full path (e.g., '/users/{id}:archive')
 * @param {object} paths - The paths object from OpenAPI document
 * @param {object} document - The full OpenAPI document
 * @returns {object|null} The resource schema or null if not found
 */
function findResourceSchemaForCustomMethod(path, paths, document) {
  // Check if this is a custom method path (contains :)
  const colonIndex = path.lastIndexOf(':');
  if (colonIndex === -1) {
    return null;
  }

  // Remove the :action portion
  const basePath = path.substring(0, colonIndex);
  const basePathItem = paths[basePath];

  if (!basePathItem) {
    return null;
  }

  // Look for GET on the base path
  if (basePathItem.get) {
    return findResourceSchema(basePathItem.get, 'get', basePathItem, document);
  }

  // Fallback: try other methods on base path
  for (const method of ['post', 'put', 'patch', 'delete']) {
    if (basePathItem[method]) {
      return findResourceSchema(
        basePathItem[method],
        method,
        basePathItem,
        document
      );
    }
  }

  return null;
}

/**
 * Determines if an operation should be linted based on whether it operates
 * on a resource with x-aep-resource annotation
 * @param {object} operation - The operation object
 * @param {string} method - The HTTP method
 * @param {string} path - The path string
 * @param {object} pathItem - The path item object
 * @param {object} document - The full OpenAPI document
 * @returns {boolean} True if the operation should be linted
 */
function shouldLintOperation(operation, method, path, pathItem, document) {
  // First try to find resource schema directly from this operation
  let resourceSchema = findResourceSchema(operation, method, pathItem, document);

  // If not found and this looks like a custom method, try that
  if (!resourceSchema && path.includes(':')) {
    resourceSchema = findResourceSchemaForCustomMethod(
      path,
      document.paths,
      document
    );
  }

  if (!resourceSchema) {
    return false;
  }

  return hasAepResource(resourceSchema, document);
}

module.exports = {
  resolveRef,
  hasAepResource,
  findResourceSchema,
  findResourceSchemaForCustomMethod,
  shouldLintOperation,
};

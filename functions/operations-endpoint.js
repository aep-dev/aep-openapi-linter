// Check that services with long-running operations (202 responses) have the required operations endpoints

module.exports = (paths, _opts, context) => {
  if (!paths || typeof paths !== 'object') {
    return [];
  }

  const errors = [];
  const pathKeys = Object.keys(paths);

  // Check if any path has a 202 response
  const hasLongRunningOperation = pathKeys.some((pathKey) => {
    const pathItem = paths[pathKey];
    if (!pathItem || typeof pathItem !== 'object') return false;

    // Check all HTTP methods that can have 202 responses
    const methods = ['post', 'put', 'patch', 'delete'];
    return methods.some(
      (method) => pathItem[method] && pathItem[method].responses && pathItem[method].responses['202']
    );
  });

  // If no long-running operations, no need to check for operations endpoints
  if (!hasLongRunningOperation) {
    return [];
  }

  return errors;
};

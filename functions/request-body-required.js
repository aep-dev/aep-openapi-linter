// Check that POST/PUT/PATCH operations on paths with x-aep-resource have required request bodies

module.exports = (pathItem, _opts, paths) => {
  // Only apply this rule if x-aep-resource is present
  if (!pathItem || !pathItem['x-aep-resource']) {
    return [];
  }

  const errors = [];
  const path = paths.path || paths.target || [];

  // Check PUT, POST, and PATCH methods
  ['put', 'post', 'patch'].forEach((method) => {
    if (pathItem[method] && pathItem[method].requestBody) {
      const requestBody = pathItem[method].requestBody;
      if (!requestBody.required) {
        errors.push({
          message: 'The body parameter is not marked as required.',
          path: [...path, method, 'requestBody'],
        });
      }
    }
  });

  return errors;
};

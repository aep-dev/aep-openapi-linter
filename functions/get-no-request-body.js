// Check that GET operations on paths with x-aep-resource do not have a request body

module.exports = (pathItem, _opts, paths) => {
  // Only apply this rule if x-aep-resource is present
  if (!pathItem || !pathItem['x-aep-resource']) {
    return [];
  }

  const errors = [];
  const path = paths.path || paths.target || [];

  // Check if GET method exists and has a requestBody
  if (pathItem.get && pathItem.get.requestBody) {
    errors.push({
      message: 'A list operation must not accept a request body.',
      path: [...path, 'get', 'requestBody'],
    });
  }

  return errors;
};

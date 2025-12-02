// Check that DELETE operations on paths with x-aep-resource do not have a request body

module.exports = (pathItem, _opts, paths) => {
  // Only apply this rule if x-aep-resource is present
  if (!pathItem || !pathItem['x-aep-resource']) {
    return [];
  }

  const errors = [];
  const path = paths.path || paths.target || [];

  // Check if DELETE method exists and has a requestBody
  if (pathItem.delete && pathItem.delete.requestBody) {
    errors.push({
      message: 'A delete operation must not accept a request body.',
      path: [...path, 'delete', 'requestBody'],
    });
  }

  return errors;
};

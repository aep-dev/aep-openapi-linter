// Check that DELETE operations on paths with x-aep-resource have a 204 or 202 response

module.exports = (pathItem, _opts, paths) => {
  // Only apply this rule if x-aep-resource is present
  if (!pathItem || !pathItem['x-aep-resource']) {
    return [];
  }

  const errors = [];
  const path = paths.path || paths.target || [];

  // Check if DELETE method exists
  if (pathItem.delete && pathItem.delete.responses) {
    const responses = pathItem.delete.responses;
    // Check if 204 or 202 response exists
    if (!responses['204'] && !responses['202']) {
      errors.push({
        message: 'A delete operation should have a `204` response.',
        path: [...path, 'delete', 'responses'],
      });
    }
  }

  return errors;
};

// Check that DELETE operations on resources with x-aep-resource have a 204 or 202 response

const { shouldLintOperation } = require('./resource-utils');

module.exports = (pathItem, _opts, context, otherValues) => {
  if (!pathItem || typeof pathItem !== 'object') {
    return [];
  }

  const errors = [];
  const pathArray = context.path || context.target || [];

  // Extract the path string from the context
  const pathString = pathArray.length >= 2 ? pathArray[1] : '';

  // Get the full document from otherValues
  const document = otherValues?.documentInventory?.resolved || otherValues?.document;

  if (!document) {
    return [];
  }

  // Check if DELETE method exists
  if (pathItem.delete && pathItem.delete.responses) {
    // Only lint if this operation is on a resource with x-aep-resource
    if (shouldLintOperation(pathItem.delete, 'delete', pathString, pathItem, document)) {
      const responses = pathItem.delete.responses;
      // Check if 204 or 202 response exists
      if (!responses['204'] && !responses['202']) {
        errors.push({
          message: 'A delete operation should have a `204` response.',
          path: [...pathArray, 'delete', 'responses'],
        });
      }
    }
  }

  return errors;
};

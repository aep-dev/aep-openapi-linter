// Check that DELETE operations on resources with x-aep-resource do not have a request body

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

  // Check if DELETE method exists and has a requestBody
  if (pathItem.delete && pathItem.delete.requestBody) {
    // Only lint if this operation is on a resource with x-aep-resource
    if (shouldLintOperation(pathItem.delete, 'delete', pathString, pathItem, document)) {
      errors.push({
        message: 'A delete operation must not accept a request body.',
        path: [...pathArray, 'delete', 'requestBody'],
      });
    }
  }

  return errors;
};

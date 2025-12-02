// Check that GET operations on resources with x-aep-resource do not have a request body

const { shouldLintOperation } = require('./resource-utils');

module.exports = (pathItem, _opts, context, otherValues) => {
  if (!pathItem || typeof pathItem !== 'object') {
    return [];
  }

  const errors = [];
  const pathArray = context.path || context.target || [];

  // Extract the path string from the context
  // The path array looks like: ['paths', '/users/{id}', ...]
  const pathString = pathArray.length >= 2 ? pathArray[1] : '';

  // Get the full document from otherValues
  const document = otherValues?.documentInventory?.resolved || otherValues?.document;

  if (!document) {
    // If we can't get the document, we can't check x-aep-resource, so skip
    return [];
  }

  // Check if GET method exists and has a requestBody
  if (pathItem.get && pathItem.get.requestBody) {
    // Only lint if this operation is on a resource with x-aep-resource
    if (shouldLintOperation(pathItem.get, 'get', pathString, pathItem, document)) {
      errors.push({
        message: 'A list operation must not accept a request body.',
        path: [...pathArray, 'get', 'requestBody'],
      });
    }
  }

  return errors;
};

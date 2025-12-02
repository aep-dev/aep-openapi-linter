// Check that POST/PUT/PATCH operations on resources with x-aep-resource have required request bodies

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

  // Check PUT, POST, and PATCH methods
  ['put', 'post', 'patch'].forEach((method) => {
    if (pathItem[method] && pathItem[method].requestBody) {
      // Only lint if this operation is on a resource with x-aep-resource
      if (shouldLintOperation(pathItem[method], method, pathString, pathItem, document)) {
        const requestBody = pathItem[method].requestBody;
        if (!requestBody.required) {
          errors.push({
            message: 'The body parameter is not marked as required.',
            path: [...pathArray, method, 'requestBody'],
          });
        }
      }
    }
  });

  return errors;
};

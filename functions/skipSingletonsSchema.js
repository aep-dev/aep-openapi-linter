// This function first checks if the target operation is for a singleton resource
// by looking for the `x-aep-resource` extension with `singleton: true`.
// If it is a singleton, it does not report any errors.
// Otherwise, it performs validation of the target using the `schema` specified in the function parameters.

// Spectral allows custom functions to invoke core functions.
// The documentation for this feature can be found at:
// https://docs.stoplight.io/docs/spectral/a781e290eb9f9-custom-functions#referencing-core-functions
// This function uses the `schema` function from Spectral to validate the operation object.
const { schema: schemaFunction } = require('@stoplight/spectral-functions');

// targetVal should be an operation object.
// The code assumes it is running on a resolved doc
module.exports = (op, opts, context) => {
  if (op === null || typeof op !== 'object') {
    return [];
  }

  // opts must contain a schema to validate the operation against
  if (opts === null || typeof opts !== 'object' || !opts.schema) {
    return [];
  }

  // Check if the operation is for a singleton resource
  const responseSchema = op.responses?.['200']?.content?.['application/json']?.schema;
  if (responseSchema?.['x-aep-resource']?.singleton) {
    return []; // No errors for singleton resources
  }

  // The operation is not for a singleton resource, apply the schema to the operation
  // and return any errors found
  const schemaErrors = schemaFunction(op, opts, context);

  return schemaErrors;
};

// Check that the parameters of an operation -- including those specified on the path -- are
// are case-insensitive unique regardless of "in".

const { shouldLintOperation } = require('./resource-utils');

// Return the "canonical" casing for a string.
// Currently just lowercase but should be extended to convert kebab/camel/snake/Pascal.
function canonical(name) {
  return typeof name === 'string' ? name.toLowerCase() : name;
}

// Accept an array and return a list of unique duplicate entries in canonical form.
// This function is intended to work on strings but is resilient to non-strings.
function dupIgnoreCase(arr) {
  if (!Array.isArray(arr)) {
    return [];
  }

  const isDup = (value, index, self) => self.indexOf(value) !== index;

  return [...new Set(arr.map((v) => canonical(v)).filter(isDup))];
}

// targetVal should be a
// [path item object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#pathItemObject).
// The code assumes it is running on a resolved doc
module.exports = (pathItem, _opts, context, otherValues) => {
  if (pathItem === null || typeof pathItem !== 'object') {
    return [];
  }

  const pathArray = context.path || context.target || [];
  const pathString = pathArray.length >= 2 ? pathArray[1] : '';

  // Get the full document from otherValues
  const document = otherValues?.documentInventory?.resolved || otherValues?.document;

  if (!document) {
    return [];
  }

  const errors = [];

  const pathParams = pathItem.parameters
    ? pathItem.parameters.map((p) => p.name)
    : [];

  // Only check parameters if at least one method on this path should be linted
  let shouldLintAnyMethod = false;
  ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].forEach((method) => {
    if (pathItem[method]) {
      if (shouldLintOperation(pathItem[method], method, pathString, pathItem, document)) {
        shouldLintAnyMethod = true;
      }
    }
  });

  if (!shouldLintAnyMethod) {
    return [];
  }

  // Check path params for dups
  const pathDups = dupIgnoreCase(pathParams);

  // Report all dups
  pathDups.forEach((dup) => {
    // get the index of all names that match dup
    const dupKeys = [...pathParams.keys()].filter(
      (k) => canonical(pathParams[k]) === dup
    );
    // Report errors for all the others
    dupKeys.slice(1).forEach((key) => {
      errors.push({
        message: `Duplicate parameter name (ignoring case): ${dup}.`,
        path: [...pathArray, 'parameters', key, 'name'],
      });
    });
  });

  ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].forEach(
    (method) => {
      // If this method exists and it has parameters, check them
      if (pathItem[method] && Array.isArray(pathItem[method].parameters)) {
        // Only check if this specific method should be linted
        if (!shouldLintOperation(pathItem[method], method, pathString, pathItem, document)) {
          return;
        }

        const allParams = [
          ...pathParams,
          ...pathItem[method].parameters.map((p) => p.name),
        ];

        // Check method params for dups -- including path params
        const dups = dupIgnoreCase(allParams);

        // Report all dups
        dups.forEach((dup) => {
          // get the index of all names that match dup
          const dupKeys = [...allParams.keys()].filter(
            (k) => canonical(allParams[k]) === dup
          );
          // Report errors for any others that are method parameters
          dupKeys
            .slice(1)
            .filter((k) => k >= pathParams.length)
            .forEach((key) => {
              errors.push({
                message: `Duplicate parameter name (ignoring case): ${dup}.`,
                path: [
                  ...pathArray,
                  method,
                  'parameters',
                  key - pathParams.length,
                  'name',
                ],
              });
            });
        });
      }
    }
  );

  return errors;
};

// Validates that standardized code fields use type string.
// Checks specific field names that must be strings according to AEP-143.

// List of field names that must be type string
const standardizedCodeFields = [
  'content_type',
  'region_code',
  'currency_code',
  'language_code',
  'time_zone',
  'utc_offset',
];

// targetVal is a schema object containing properties
module.exports = (schema, _opts, paths) => {
  if (!schema || typeof schema !== 'object') {
    return [];
  }

  const errors = [];
  const path = paths.path || paths.target || [];

  // Check if this is a schema with properties
  if (schema.properties && typeof schema.properties === 'object') {
    Object.keys(schema.properties).forEach((propertyName) => {
      if (standardizedCodeFields.includes(propertyName)) {
        const property = schema.properties[propertyName];
        if (property && property.type && property.type !== 'string') {
          errors.push({
            message: `The field "${propertyName}" should be of type "string", not "${property.type}".`,
            path: [...path, 'properties', propertyName, 'type'],
          });
        }
      }
    });
  }

  return errors;
};

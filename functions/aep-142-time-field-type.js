/**
 * Validates that fields with time-related suffixes use the correct OpenAPI types.
 *
 * Based on AEP-142 specification (https://aep.dev/142).
 *
 * AEP-documented suffixes and their expected types:
 * - _time, _times → string with format: date-time (RFC 3339)
 * - _date → string with format: date
 * - _seconds → integer or number
 * - _millis → integer or number
 * - _micros → integer or number
 * - _nanos → integer or number
 *
 * @param {object} field - The field object being validated
 * @param {object} _opts - Options (unused)
 * @param {object} context - Spectral context containing the path
 * @returns {Array<object>} Array of error objects, or empty array if valid
 */

/**
 * Extracts type info from a field, handling OpenAPI 3.1 nullable patterns.
 * Supports: type arrays (['string', 'null']), anyOf/oneOf with null
 * @param {object} field - The field schema object
 * @returns {{type: string|undefined, format: string|undefined, items: object|undefined}}
 */
function getFieldTypeInfo(field) {
  if (!field || typeof field !== 'object') {
    return {};
  }
  // Handle type arrays: type: ['string', 'null']
  if (Array.isArray(field.type)) {
    const nonNullType = field.type.find((t) => t !== 'null');
    if (nonNullType) {
      return { type: nonNullType, format: field.format, items: field.items };
    }
  }
  // Direct type (non-null)
  if (field.type && field.type !== 'null') {
    return { type: field.type, format: field.format, items: field.items };
  }
  // Handle anyOf/oneOf nullable patterns
  const schemas = field.anyOf || field.oneOf;
  if (Array.isArray(schemas)) {
    const nonNull = schemas.find((s) => s.type && s.type !== 'null');
    if (nonNull) {
      return { type: nonNull.type, format: nonNull.format, items: nonNull.items };
    }
  }
  return { type: field.type, format: field.format, items: field.items };
}

module.exports = (field, _opts, context) => {
  if (!field || typeof field !== 'object') {
    return [];
  }

  // Extract the field name from the path - it should be the last element
  // path looks like:
  // ['paths', '/test', 'get', 'responses', '200', 'content',
  //  'application/json', 'schema', 'properties', 'create_time']
  const path = context.path || [];
  const fieldName = path[path.length - 1];

  if (typeof fieldName !== 'string' || !fieldName.includes('_')) {
    return [];
  }

  // Extract the suffix (last word after underscore)
  const parts = fieldName.split('_');
  const suffix = parts[parts.length - 1];

  // Define suffix categories and their expected types (AEP-142 documented only)
  const timestampSuffixes = ['time', 'times'];
  const dateSuffixes = ['date'];
  const durationSecondSuffixes = ['seconds'];
  const durationMilliSuffixes = ['millis'];
  const durationMicroSuffixes = ['micros'];
  const durationNanoSuffixes = ['nanos'];

  const allSuffixes = [
    ...timestampSuffixes,
    ...dateSuffixes,
    ...durationSecondSuffixes,
    ...durationMilliSuffixes,
    ...durationMicroSuffixes,
    ...durationNanoSuffixes,
  ];

  // Check if this field has a time-related suffix
  if (!allSuffixes.includes(suffix)) {
    return [];
  }

  const errors = [];
  const typeInfo = getFieldTypeInfo(field);

  // Validate timestamp fields (_time, _times)
  if (timestampSuffixes.includes(suffix)) {
    // For _times (plural), allow arrays of timestamps
    if (suffix === 'times' && typeInfo.type === 'array') {
      // Check that array items are strings with date-time format
      const itemsInfo = typeInfo.items ? getFieldTypeInfo(typeInfo.items) : {};
      if (itemsInfo.type !== 'string' || itemsInfo.format !== 'date-time') {
        errors.push({
          message:
            `Field "${fieldName}" should be an array with items of type "string" ` +
            `and format "date-time" (RFC 3339 timestamp).`,
        });
      }
    } else if (typeInfo.type !== 'string' || typeInfo.format !== 'date-time') {
      errors.push({
        message: `Field "${fieldName}" should have type "string" and format "date-time" (RFC 3339 timestamp).`,
      });
    }
  }

  // Validate date fields (_date)
  else if (dateSuffixes.includes(suffix)) {
    if (typeInfo.type !== 'string' || typeInfo.format !== 'date') {
      errors.push({
        message: `Field "${fieldName}" should have type "string" and format "date" (RFC 3339 date).`,
      });
    }
  }

  // Validate duration fields (seconds, millis, micros, nanos)
  else if (
    durationSecondSuffixes.includes(suffix) ||
    durationMilliSuffixes.includes(suffix) ||
    durationMicroSuffixes.includes(suffix) ||
    durationNanoSuffixes.includes(suffix)
  ) {
    // Duration fields should be integers (or numbers for fractional values)
    if (typeInfo.type !== 'integer' && typeInfo.type !== 'number') {
      errors.push({
        message: `Field "${fieldName}" should have type "integer" or "number" for duration values.`,
      });
    }
  }

  return errors;
};

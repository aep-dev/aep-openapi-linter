/**
 * Validates that nullable enums have null as the first value.
 *
 * Based on AEP-126 specification (https://aep.dev/126).
 *
 * @param {object} field - The field object containing the enum
 * @param {object} _opts - Options (unused)
 * @param {object} context - Spectral context containing the path
 * @returns {Array<object>} Array of error objects, or empty array if valid
 */
module.exports = (field, _opts, context) => {
  if (!field || typeof field !== 'object') {
    return [];
  }

  // Check if field is nullable
  // OpenAPI 3.0: nullable: true
  // OpenAPI 3.1: type: ['string', 'null'] or type: 'null'
  const isNullable = field.nullable === true ||
                     (Array.isArray(field.type) && field.type.includes('null'));

  if (!isNullable) {
    return [];
  }

  // Get enum array
  const enumValues = field.enum;
  if (!Array.isArray(enumValues) || enumValues.length === 0) {
    return [];
  }

  // Check if null exists in the enum
  const hasNull = enumValues.includes(null);
  if (!hasNull) {
    return [];
  }

  // Check if null is the first value
  if (enumValues[0] !== null) {
    const fieldName = context.path[context.path.length - 1];
    return [
      {
        message: `Enum field "${fieldName}" contains "null" and is nullable, but "null" must be the first value.`,
      },
    ];
  }

  return [];
};

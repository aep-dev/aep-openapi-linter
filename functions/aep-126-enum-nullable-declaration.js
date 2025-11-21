/**
 * Validates that enums containing null also declare nullable: true.
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

  // Check if nullable is declared
  // OpenAPI 3.0: nullable: true
  // OpenAPI 3.1: type: ['string', 'null'] or type: 'null'
  const isNullable = field.nullable === true || (Array.isArray(field.type) && field.type.includes('null'));

  if (!isNullable) {
    const fieldName = context.path[context.path.length - 1];
    return [
      {
        message:
          `Enum field "${fieldName}" contains "null" value but does not declare nullable ` +
          `(use "nullable: true" in OAS 3.0 or "type: ['string', 'null']" in OAS 3.1).`,
      },
    ];
  }

  return [];
};

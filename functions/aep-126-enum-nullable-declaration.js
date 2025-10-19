/**
 * Validates that enums containing null also declare nullable: true.
 *
 * Based on AEP-126 specification (https://aep.dev/126).
 *
 * @param {object} field - The field object containing the enum
 * @returns {Array<object>} Array of error objects, or empty array if valid
 */
module.exports = (field) => {
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

  // Check if nullable is declared as true
  if (field.nullable !== true) {
    return [
      {
        message: 'Enum contains "null" value but field does not declare "nullable: true".',
      },
    ];
  }

  return [];
};

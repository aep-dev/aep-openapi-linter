/**
 * Validates that nullable enums have null as the first value.
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

  // Check if field is nullable
  if (field.nullable !== true) {
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
    return [
      {
        message: 'When enum contains "null" and field is nullable, "null" must be the first value.',
      },
    ];
  }

  return [];
};

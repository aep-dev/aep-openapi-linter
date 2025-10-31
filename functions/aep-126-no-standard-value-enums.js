/**
 * Validates that fields don't enumerate standard codes.
 *
 * Based on AEP-126 specification (https://aep.dev/126).
 *
 * Standard codes like language, country, currency should not be enumerated.
 *
 * @param {object} _targetVal - The target value (unused, we check the field name)
 * @param {object} _opts - Options (unused)
 * @param {object} context - Spectral context containing the path
 * @returns {Array<object>} Array of error objects, or empty array if valid
 */
module.exports = (field, _opts, context) => {
  // Only check string enums
  if (!field || typeof field !== 'object' || field.type !== 'string') {
    return [];
  }

  // Extract the field name from the path
  const path = context.path || [];
  const fieldName = path[path.length - 1];

  if (typeof fieldName !== 'string') {
    return [];
  }

  // List of standard field names that should not be enumerated
  const standardFields = [
    'language',
    'language_code',
    'country',
    'country_code',
    'region_code',
    'currency',
    'currency_code',
    'media_type',
    'content_type',
  ];

  if (standardFields.includes(fieldName)) {
    const message =
      `Field "${fieldName}" appears to enumerate standard codes. ` +
      `Use standard formats instead ` +
      `(e.g., ISO 639 for languages, ISO 3166 for countries, ` +
      `ISO 4217 for currencies, IANA for media types).`;
    return [
      {
        message,
      },
    ];
  }

  return [];
};

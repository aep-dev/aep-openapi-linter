// Validates that standardized code field names follow AEP-143 conventions.
// Checks schema property names and suggests correct standardized field names.

// Map of incorrect field name variants to their correct standardized names
const fieldNameVariants = {
  // Content/Media types
  mime: 'content_type',
  mimetype: 'content_type',
  mime_type: 'content_type',
  media_type: 'content_type',
  mediatype: 'content_type',
  // Countries/Regions
  country: 'region_code',
  country_code: 'region_code',
  region: 'region_code',
  // Currency
  currency: 'currency_code',
  // Language
  lang: 'language_code',
  language: 'language_code',
  locale: 'language_code',
  // Time zones
  tz: 'time_zone',
  timezone: 'time_zone',
};

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
      const correctName = fieldNameVariants[propertyName];
      if (correctName) {
        errors.push({
          message: `Use "${correctName}" instead of "${propertyName}" for standardized code fields.`,
          path: [...path, 'properties', propertyName],
        });
      }
    });
  }

  return errors;
};

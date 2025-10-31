/**
 * Validates that all enum values in a field use consistent case formatting.
 *
 * Based on AEP-126 specification (https://aep.dev/126).
 *
 * AEP-126 states: "All enum values should use a consistent case format across
 * an organization." This rule checks that all values within a single enum use
 * the same case style, without enforcing a specific case format.
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

  // Only check string enums
  if (field.type !== 'string') {
    return [];
  }

  // Get enum array
  const enumValues = field.enum;
  if (!Array.isArray(enumValues) || enumValues.length === 0) {
    return [];
  }

  // Filter out null values - they don't have case
  const stringValues = enumValues.filter((v) => v !== null && typeof v === 'string');

  // If less than 2 string values, no consistency check needed
  if (stringValues.length < 2) {
    return [];
  }

  /**
   * Detect the case style of a string value.
   * Returns one of: 'UPPER', 'lower', 'camelCase', 'PascalCase', 'kebab-case', 'snake_case', 'UPPER_SNAKE', 'mixed'
   */
  const detectCase = (str) => {
    if (!str || typeof str !== 'string') return 'unknown';

    // Check for all uppercase (UPPERCASE or UPPER_SNAKE_CASE)
    if (str === str.toUpperCase()) {
      if (str.includes('_')) return 'UPPER_SNAKE';
      if (str.includes('-')) return 'UPPER-KEBAB';
      return 'UPPER';
    }

    // Check for all lowercase
    if (str === str.toLowerCase()) {
      if (str.includes('_')) return 'snake_case';
      if (str.includes('-')) return 'kebab-case';
      return 'lower';
    }

    // Check for PascalCase (starts with uppercase, has mixed case, no separators)
    if (/^[A-Z][a-zA-Z0-9]*$/.test(str) && str !== str.toUpperCase()) {
      return 'PascalCase';
    }

    // Check for camelCase (starts with lowercase, has mixed case, no separators)
    if (/^[a-z][a-zA-Z0-9]*$/.test(str)) {
      return 'camelCase';
    }

    // Mixed case with separators
    if (str.includes('_')) return 'Mixed_Snake';
    if (str.includes('-')) return 'Mixed-Kebab';

    return 'mixed';
  };

  // Detect case for all string values
  const cases = stringValues.map((value) => ({
    value,
    case: detectCase(value),
  }));

  // Get unique case styles
  const caseStyles = [...new Set(cases.map((c) => c.case))];

  // Normalize compatible case styles
  // Lowercase variants (lower, kebab-case, snake_case) are compatible
  // Uppercase variants (UPPER, UPPER_SNAKE, UPPER-KEBAB) are compatible
  const normalizedStyles = caseStyles.map((style) => {
    if (style === 'lower' || style === 'kebab-case' || style === 'snake_case') {
      return 'lowercase-family';
    }
    if (style === 'UPPER' || style === 'UPPER_SNAKE' || style === 'UPPER-KEBAB') {
      return 'uppercase-family';
    }
    return style;
  });

  const uniqueNormalizedStyles = [...new Set(normalizedStyles)];

  // If more than one normalized case style, report inconsistency
  if (uniqueNormalizedStyles.length > 1) {
    const fieldName = context.path[context.path.length - 1];
    const caseExamples = cases
      .map((c) => `"${c.value}" (${c.case})`)
      .slice(0, 3)
      .join(', ');

    const suffix = cases.length > 3 ? ', ...' : '';
    const message =
      `Enum field "${fieldName}" has inconsistent case formatting. ` +
      `Found: ${caseExamples}${suffix}. ` +
      `All values should use the same case style.`;

    return [
      {
        message,
      },
    ];
  }

  return [];
};

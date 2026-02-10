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

  /**
   * Detect the case style of a string value.
   * Returns one of:
   * - 'UPPER', 'UPPER_SNAKE', 'UPPER-KEBAB',
   * - 'lower', 'snake_case', 'kebab-case',
   * - 'PascalCase',
   * - 'camelCase',
   * - 'unknown' (not a string or empty or unrecognized format)
   */
  const detectCase = (str) => {
    if (!str || typeof str !== 'string') return 'unknown';

    // Check for all uppercase (UPPER, UPPER_SNAKE, or UPPER-KEBAB)
    if (str === str.toUpperCase()) {
      if (str.includes('_')) return 'UPPER_SNAKE';
      if (str.includes('-')) return 'UPPER-KEBAB';
      return 'UPPER';
    }

    // Check for all lowercase (lower, snake_case, or kebab-case)
    if (str === str.toLowerCase()) {
      if (str.includes('_')) return 'snake_case';
      if (str.includes('-')) return 'kebab-case';
      return 'lower';
    }

    // Check for PascalCase (starts with uppercase, has mixed case, no separators)
    if (/^[A-Z]([a-z0-9]+[A-Z]?)*[a-z0-9]*$/.test(str)) {
      return 'PascalCase';
    }

    // Check for camelCase (starts with lowercase, has mixed case, no separators)
    if (/^[a-z]([a-z0-9]+[A-Z]?)*[A-Z][a-zA-Z0-9]*$/.test(str)) {
      return 'camelCase';
    }

    return 'unknown';
  };

  const cases = enumValues
    .filter((v) => v !== null)
    .map((v) => ({
      value: v,
      case: detectCase(v),
    }));
  const caseStyles = [...new Set(cases.map((c) => c.case))];

  // Check for valid combinations explicitly
  let isValid = false;

  if (caseStyles.length === 1 && !caseStyles.includes('unknown')) {
    // Single known case style is valid
    isValid = true;
    // Two case styles - check valid combinations
  } else if (caseStyles.every((c) => ['UPPER', 'UPPER_SNAKE'].includes(c))) {
    isValid = true;
  } else if (caseStyles.every((c) => ['UPPER', 'UPPER-KEBAB'].includes(c))) {
    isValid = true;
  } else if (caseStyles.every((c) => ['lower', 'snake_case'].includes(c))) {
    isValid = true;
  } else if (caseStyles.every((c) => ['lower', 'kebab-case'].includes(c))) {
    isValid = true;
  } else if (caseStyles.every((c) => ['lower', 'camelCase'].includes(c))) {
    isValid = true;
  }

  if (!isValid) {
    const fieldName = context.path[context.path.length - 1];

    if (caseStyles.includes('unknown')) {
      const unknownValues = cases
        .filter((c) => c.case === 'unknown')
        .map((c) => `"${c.value}"`)
        .slice(0, 3)
        .join(', ');
      const suffix = cases.filter((c) => c.case === 'unknown').length > 3 ? ', ...' : '';
      return [
        {
          message: `Enum field "${fieldName}" contains values with unknown case styles: ${unknownValues}${suffix}`,
        },
      ];
    }

    const caseExamples = cases
      .map((c) => `"${c.value}" (${c.case})`)
      .slice(0, 3)
      .join(', ');
    const suffix = cases.length > 3 ? ', ...' : '';

    return [
      {
        message:
          `Enum field "${fieldName}" contains values with inconsistent case styles. ` +
          `Found: ${caseExamples}${suffix}. `,
      },
    ];
  }

  return [];
};

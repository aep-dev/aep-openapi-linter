/**
 * Validates that collection identifiers in paths use kebab-case.
 *
 * Based on AEP-122 specification (https://aep.dev/122).
 *
 * Collection identifiers must use kebab-case (lowercase with hyphens):
 * - Valid: /publishers/{publisher}/books/{book}
 * - Valid: /electronic-books/{book}
 * - Invalid: /electronicBooks/{book} (camelCase)
 * - Invalid: /electronic_books/{book} (snake_case)
 *
 * Path parameters (e.g., {user_id}) are NOT checked by this rule.
 *
 * @param {string} pathPattern - The path pattern string (e.g., "/users/{user_id}")
 * @returns {Array<object>} Array of error objects, or empty array if valid
 */
module.exports = (pathPattern) => {
  if (typeof pathPattern !== 'string') {
    return [];
  }

  // Split path into segments: "/users/{id}/books" → ["", "users", "{id}", "books"]
  const segments = pathPattern.split('/');

  const errors = [];

  segments
    .filter((segment) => segment) // Skip empty segments
    .filter((segment) => !(segment.startsWith('{') && segment.endsWith('}'))) // Skip path parameters
    .forEach((segment) => {
      // Handle custom methods: /books/{book}:archive → check "books" but skip ":archive"
      const [mainPart, customMethod] = segment.split(':');

      // Check the main collection part (before any :customMethod)
      if (mainPart && !mainPart.startsWith('{')) {
        // Check for uppercase letters or underscores
        if (/[A-Z_]/.test(mainPart)) {
          const message =
            `Collection identifier "${mainPart}" must be in kebab-case ` +
            `(e.g., 'electronic-books', not 'electronicBooks' or 'electronic_books')`;
          errors.push({ message });
        }
      }

      // Check custom method part if present
      if (customMethod && /[A-Z_]/.test(customMethod)) {
        errors.push({
          message: `Custom method "${customMethod}" must be in kebab-case`,
        });
      }
    });

  return errors;
};

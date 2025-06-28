// Shared utility functions for singleton resource validation
// according to AEP-156 specifications

/**
 * Normalize a path or pattern: ensure leading slash, no duplicate slashes
 * @param {string} str
 * @returns {string}
 */
function normalizePath(str) {
  if (!str) return '';
  // Remove leading/trailing whitespace, ensure leading slash, remove duplicate slashes
  let s = str.trim();
  if (!s.startsWith('/')) s = '/' + s;
  s = s.replace(/\/+/g, '/');
  return s;
}

/**
 * Get all singleton resource patterns from the OAS document
 * @param {Object} oasDoc - The OpenAPI document
 * @returns {Array} Array of singleton patterns
 */
function getSingletonPatterns(oasDoc) {
  if (!oasDoc || !oasDoc.components || !oasDoc.components.schemas) {
    return [];
  }
  const singletonPatterns = [];
  const { schemas } = oasDoc.components;
  Object.values(schemas).forEach(schema => {
    if (
      schema &&
      schema['x-aep-resource'] &&
      schema['x-aep-resource'].singleton === true &&
      Array.isArray(schema['x-aep-resource'].patterns)
    ) {
      singletonPatterns.push(...schema['x-aep-resource'].patterns);
    }
  });
  return singletonPatterns;
}

/**
 * Check if a path string matches any singleton pattern exactly
 * @param {string} pathString - The path to check
 * @param {Object} oasDoc - The OpenAPI document
 * @returns {boolean} True if the path matches a singleton pattern
 */
function pathMatchesSingletonPattern(pathString, oasDoc) {
  if (!pathString) return false;
  const normalizedPath = normalizePath(pathString);
  const singletonPatterns = getSingletonPatterns(oasDoc);
  return singletonPatterns.some(pattern => {
    const normalizedPattern = normalizePath(pattern);
    const regexPattern = `^${normalizedPattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\{[^/]+\}/g, '[^/]+')}$`;
    const regex = new RegExp(regexPattern);
    return regex.test(normalizedPath);
  });
}

/**
 * Check if a path string matches a singleton list pattern
 * @param {string} pathString - The path to check
 * @param {Object} oasDoc - The OpenAPI document
 * @returns {boolean} True if the path matches a singleton list pattern
 */
function pathMatchesSingletonListPattern(pathString, oasDoc) {
  if (!pathString) return false;
  const normalizedPath = normalizePath(pathString);
  const singletonPatterns = getSingletonPatterns(oasDoc);
  return singletonPatterns.some(pattern => {
    // Convert singleton pattern to list pattern: {parent}/{parent-id}/{singleton} -> {parent}/-/configs
    const listPattern = pattern.replace(/\/[^/]+$/, '/-/configs');
    const normalizedListPattern = normalizePath(listPattern);
    const regexPattern = `^${normalizedListPattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\{[^/]+\}/g, '[^/]+')}$`;
    const regex = new RegExp(regexPattern);
    return regex.test(normalizedPath);
  });
}

module.exports = {
  getSingletonPatterns,
  pathMatchesSingletonPattern,
  pathMatchesSingletonListPattern,
  normalizePath
}; 
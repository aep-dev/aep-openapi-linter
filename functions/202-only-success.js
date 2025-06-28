// Custom function to ensure that if 202 is present, forbidden codes (200, 201, 204) are not present
// Usage: pass { forbidden: '200' } or '201' or '204' as options

module.exports = (responses, opts, context) => {
  if (!responses || typeof responses !== 'object') {
    return [];
  }
  const forbidden = opts && opts.forbidden;
  if (!forbidden) {
    return [];
  }
  if (
    Object.prototype.hasOwnProperty.call(responses, '202') &&
    Object.prototype.hasOwnProperty.call(responses, forbidden)
  ) {
    return [
      {
        message: `Long-running operations must return 202 as the only success status code, not ${forbidden}`,
        path: context.path.concat([forbidden]),
      },
    ];
  }
  return [];
};

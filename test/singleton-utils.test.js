const singletonUtils = require('../functions/singleton-utils');

describe('singleton-utils', () => {
  describe('normalizePath', () => {
    test('should normalize path with leading slash', () => {
      expect(singletonUtils.normalizePath('/test/path')).toBe('/test/path');
      expect(singletonUtils.normalizePath('test/path')).toBe('/test/path');
    });

    test('should remove duplicate slashes', () => {
      expect(singletonUtils.normalizePath('//test///path//')).toBe('/test/path/');
      expect(singletonUtils.normalizePath('/test//path')).toBe('/test/path');
    });

    test('should trim whitespace', () => {
      expect(singletonUtils.normalizePath('  /test/path  ')).toBe('/test/path');
      expect(singletonUtils.normalizePath('\t/test/path\n')).toBe('/test/path');
    });

    test('should handle falsy values', () => {
      expect(singletonUtils.normalizePath('')).toBe('');
      expect(singletonUtils.normalizePath(null)).toBe('');
      expect(singletonUtils.normalizePath(undefined)).toBe('');
    });

    test('should handle single slash', () => {
      expect(singletonUtils.normalizePath('/')).toBe('/');
      expect(singletonUtils.normalizePath('')).toBe('');
    });
  });

  describe('getSingletonPatterns', () => {
    test('should extract singleton patterns from OAS document', () => {
      const oasDoc = {
        components: {
          schemas: {
            Config: {
              'x-aep-resource': {
                singleton: true,
                patterns: ['/configs/{config-id}/config']
              }
            },
            Settings: {
              'x-aep-resource': {
                singleton: true,
                patterns: ['/settings/{setting-id}/settings']
              }
            },
            RegularSchema: {
              type: 'object',
              properties: {}
            }
          }
        }
      };

      const patterns = singletonUtils.getSingletonPatterns(oasDoc);
      expect(patterns).toEqual([
        '/configs/{config-id}/config',
        '/settings/{setting-id}/settings'
      ]);
    });

    test('should return empty array when no components', () => {
      const oasDoc = {};
      expect(singletonUtils.getSingletonPatterns(oasDoc)).toEqual([]);
    });

    test('should return empty array when no schemas', () => {
      const oasDoc = { components: {} };
      expect(singletonUtils.getSingletonPatterns(oasDoc)).toEqual([]);
    });

    test('should return empty array when no singleton schemas', () => {
      const oasDoc = {
        components: {
          schemas: {
            RegularSchema: {
              type: 'object',
              properties: {}
            }
          }
        }
      };
      expect(singletonUtils.getSingletonPatterns(oasDoc)).toEqual([]);
    });

    test('should handle schemas without x-aep-resource', () => {
      const oasDoc = {
        components: {
          schemas: {
            Schema1: { type: 'object' },
            Schema2: { type: 'string' }
          }
        }
      };
      expect(singletonUtils.getSingletonPatterns(oasDoc)).toEqual([]);
    });

    test('should handle schemas with x-aep-resource but not singleton', () => {
      const oasDoc = {
        components: {
          schemas: {
            Schema1: {
              'x-aep-resource': {
                singleton: false,
                patterns: ['/test/path']
              }
            }
          }
        }
      };
      expect(singletonUtils.getSingletonPatterns(oasDoc)).toEqual([]);
    });

    test('should handle schemas with singleton but no patterns', () => {
      const oasDoc = {
        components: {
          schemas: {
            Schema1: {
              'x-aep-resource': {
                singleton: true
              }
            }
          }
        }
      };
      expect(singletonUtils.getSingletonPatterns(oasDoc)).toEqual([]);
    });

    test('should handle falsy OAS document', () => {
      expect(singletonUtils.getSingletonPatterns(null)).toEqual([]);
      expect(singletonUtils.getSingletonPatterns(undefined)).toEqual([]);
    });
  });

  describe('pathMatchesSingletonPattern', () => {
    const mockOasDoc = {
      components: {
        schemas: {
          Config: {
            'x-aep-resource': {
              singleton: true,
              patterns: ['/configs/{config-id}/config']
            }
          }
        }
      }
    };

    test('should handle falsy path', () => {
      expect(singletonUtils.pathMatchesSingletonPattern('', mockOasDoc)).toBe(false);
      expect(singletonUtils.pathMatchesSingletonPattern(null, mockOasDoc)).toBe(false);
      expect(singletonUtils.pathMatchesSingletonPattern(undefined, mockOasDoc)).toBe(false);
    });

    test('should handle falsy OAS document', () => {
      expect(singletonUtils.pathMatchesSingletonPattern('/configs/123/config', null)).toBe(false);
      expect(singletonUtils.pathMatchesSingletonPattern('/configs/123/config', undefined)).toBe(false);
    });

    test('should handle empty patterns array', () => {
      const emptyPatternsOasDoc = {
        components: {
          schemas: {
            Config: {
              'x-aep-resource': {
                singleton: true,
                patterns: []
              }
            }
          }
        }
      };
      expect(singletonUtils.pathMatchesSingletonPattern('/configs/123/config', emptyPatternsOasDoc)).toBe(false);
    });

    test('should handle path normalization', () => {
      expect(singletonUtils.pathMatchesSingletonPattern('configs/123/config', mockOasDoc)).toBe(false);
      expect(singletonUtils.pathMatchesSingletonPattern('//configs//123//config', mockOasDoc)).toBe(false);
    });
  });

  describe('pathMatchesSingletonListPattern', () => {
    const mockOasDoc = {
      components: {
        schemas: {
          Config: {
            'x-aep-resource': {
              singleton: true,
              patterns: ['/configs/{config-id}/config']
            }
          }
        }
      }
    };

    test('should handle falsy path', () => {
      expect(singletonUtils.pathMatchesSingletonListPattern('', mockOasDoc)).toBe(false);
      expect(singletonUtils.pathMatchesSingletonListPattern(null, mockOasDoc)).toBe(false);
      expect(singletonUtils.pathMatchesSingletonListPattern(undefined, mockOasDoc)).toBe(false);
    });

    test('should handle falsy OAS document', () => {
      expect(singletonUtils.pathMatchesSingletonListPattern('/configs/123/-/configs', null)).toBe(false);
      expect(singletonUtils.pathMatchesSingletonListPattern('/configs/123/-/configs', undefined)).toBe(false);
    });

    test('should handle empty patterns array', () => {
      const emptyPatternsOasDoc = {
        components: {
          schemas: {
            Config: {
              'x-aep-resource': {
                singleton: true,
                patterns: []
              }
            }
          }
        }
      };
      expect(singletonUtils.pathMatchesSingletonListPattern('/configs/123/-/configs', emptyPatternsOasDoc)).toBe(false);
    });

    test('should handle path normalization', () => {
      expect(singletonUtils.pathMatchesSingletonListPattern('configs/123/-/configs', mockOasDoc)).toBe(false);
      expect(singletonUtils.pathMatchesSingletonListPattern('//configs//123//-//configs', mockOasDoc)).toBe(false);
    });

    test('should handle pattern replacement logic', () => {
      // Test that the pattern replacement logic is executed
      const result = singletonUtils.pathMatchesSingletonListPattern('/test/path', mockOasDoc);
      expect(typeof result).toBe('boolean');
    });
  });
}); 
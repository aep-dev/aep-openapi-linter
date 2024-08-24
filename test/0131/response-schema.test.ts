import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "../utils";

testRule('aep-131-response-schema', [
  {
    name: 'should find no errors',
    document: {
      openapi: '3.0.3',
      paths: {
        '/{userId}': {
          get: {
            responseBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    "x-aep-resource": {
                      singular: "User"
                    }
                  },
                },
              },
            },
          },
        },
      },
    },
    errors: []
  },
  {
    name: 'should find no errors with references',
    document: {
      openapi: '3.0.3',
      components: {
        schemas: {
          User: {
            type: "object",
            "x-aep-resource": {
              singular: "user"
            }
          }
        }
      },
      paths: {
        '/{userId}': {
          get: {
            responseBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    "x-aep-resource": {
                      singular: "User"
                    }
                  },
                },
              },
            },
          },
        },
      },
    },
    errors: []
  },
  {
    name: 'does not include AEP extension',
    document: {
      openapi: '3.0.3',
      paths: {
        '/{userId}': {
          get: {
            responseBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
    errors: [
      {
        message: "The response body does not include an AEP resource.",
        path: ["paths", "/{userId}", "get", "responseBody", "content", "application/json", "schema"],
        severity: DiagnosticSeverity.Error
      }
    ]
  },
  {
    name: 'has an extra field',
    document: {
      openapi: '3.0.3',
      paths: {
        '/{userId}': {
          get: {
            responseBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: [
                      {
                        name: 'user',
                        type: 'object',
                        "x-aep-resource": {
                          singular: "User"
                        }
                      },
                      {
                        name: 'extra_field',
                        type: 'string'
                      }
                    ]
                  },
                },
              },
            },
          },
        },
      },
    },
    errors: [
      {
        message: "The response body does not include an AEP resource.",
        path: ["paths", "/{userId}", "get", "responseBody", "content", "application/json", "schema"],
        severity: DiagnosticSeverity.Error
      }
    ]
  },
]);
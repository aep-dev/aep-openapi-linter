import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./utils";

testRule('aep-request-body-optional', [
  {
    name: "should find errors",
    document: {
      openapi: '3.0.3',
      paths: {
        '/test1': {
          put: {
            requestBody: {
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
        '/test2': {
          patch: {
            requestBody: {
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
        '/test3': {
          post: {
            requestBody: {
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
        message: "The body parameter is not marked as required.",
        path: ["paths", "/test1", "put", "requestBody"],
        severity: DiagnosticSeverity.Warning,
      },
      {
        message: "The body parameter is not marked as required.",
        path: ["paths", "/test2", "patch", "requestBody"],
        severity: DiagnosticSeverity.Warning,
      },
      {
        message: "The body parameter is not marked as required.",
        path: ["paths", "/test3", "post", "requestBody"],
        severity: DiagnosticSeverity.Warning,
      }
    ]
  },
  {
    name: "should find no errors",
    document: {
      openapi: '3.0.3',
      paths: {
        '/test1': {
          put: {
            requestBody: {
              required: true,
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
        '/test2': {
          patch: {
            requestBody: {
              required: true,
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
        '/test3': {
          post: {
            requestBody: {
              required: true,
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
    errors: []
  }
]);
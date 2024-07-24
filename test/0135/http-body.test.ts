import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "../utils";

testRule('aep-135-http-body', [
  {
    name: "should find errors",
    document: {
      openapi: '3.0.3',
      paths: {
        '/test1': {
          delete: {
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
        message: "A delete operation must not accept a request body.",
        path: ["paths", "/test1", "delete", "requestBody"],
        severity: DiagnosticSeverity.Error
      }
    ]
  },
  {
    name: "should find no errors",
    document: {
      openapi: '3.0.3',
      paths: {
        '/test1': {
          delete: {},
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
      },
    },
    errors: []
  }
]
);
import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "../utils";

testRule('aep-135-response-204', [
  {
    name: "should find errors",
    document: {
      openapi: '3.0.3',
      paths: {
        '/api/Paths': {
          delete: {
            responses: {
              200: {
                description: 'Success',
              },
            },
          },
        },
      },
    },
    errors: [
      {
        message: "A delete operation should have a `204` response.",
        path: ["paths", "/api/Paths", "delete", "responses"],
        severity: DiagnosticSeverity.Warning
      }
    ]
  },
  {
    name: "should find no errors",
    document: {
      openapi: '3.0.3',
      paths: {
        '/api/Paths': {
          delete: {
            responses: {
              204: {
                description: 'Success',
              },
            },
          },
        },
        '/test202': {
          delete: {
            responses: {
              202: {
                description: 'Success',
              },
            },
          },
        },
      },
    },
    errors: []
  }
]);
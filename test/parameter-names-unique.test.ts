import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "./utils";


testRule('aep-parameter-names-unique', [
  {
    name: 'should find errors',
    document: {
      openapi: '3.0.3',
      paths: {
        '/test1/{p1}': {
          parameters: [
            {
              name: 'p1',
              in: 'path',
              type: 'string',
            },
            // Legal in OAS2 for same name w/ different in
            {
              name: 'p1',
              in: 'query',
              type: 'string',
            },
            {
              name: 'p2',
              in: 'query',
              type: 'string',
            },
          ],
          get: {
            parameters: [
              {
                name: 'p1',
                in: 'header',
                type: 'string',
              },
              {
                $ref: '#/parameters/Param2',
              },
              {
                name: 'p3',
                in: 'query',
                type: 'string',
              },
              {
                name: 'p3',
                in: 'header',
                type: 'string',
              },
            ],
          },
        },
      },
      parameters: {
        Param2: {
          name: 'p2',
          in: 'header',
          type: 'integer',
        },
      },
    },
    errors: [
      {
        message: "Duplicate parameter name (ignoring case) with parameters.0.",
        path: ["paths", "/test1/{p1}", "parameters", "1", "name"],
        severity: DiagnosticSeverity.Warning,
      },
      {
        message: "Duplicate parameter name (ignoring case) with parameters.0.",
        path: ["paths", "/test1/{p1}", "get", "parameters", "0", "name"],
        severity: DiagnosticSeverity.Warning,
      },
      {
        message: "Duplicate parameter name (ignoring case) with parameters.2.",
        path: ["paths", "/test1/{p1}", "get", "parameters", "1", "name"],
        severity: DiagnosticSeverity.Warning,
      },
      {
        message: "Duplicate parameter name (ignoring case) with get.parameters.2.",
        path: ["paths", "/test1/{p1}", "get", "parameters", "3", "name"],
        severity: DiagnosticSeverity.Warning,
      },
    ]
  },
  {
    name: "no errors",
    document: {
      openapi: '3.0.3',
      paths: {
        '/test1/{id}': {
          parameters: [
            {
              name: 'id',
              in: 'path',
              type: 'string',
            },
            {
              name: 'fooBar',
              in: 'query',
              type: 'string',
            },
            {
              name: 'foo-bar',
              in: 'header',
              type: 'string',
            },
          ],
          get: {
            parameters: [
              {
                name: 'resourceId',
                in: 'query',
                type: 'string',
              },
              {
                $ref: '#/parameters/SkipParam',
              },
            ],
          },
        },
      },
      parameters: {
        SkipParam: {
          name: 'skip',
          in: 'query',
          type: 'integer',
        },
      },
    },
    errors: [],
  }
]);
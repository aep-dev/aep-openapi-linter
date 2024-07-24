import { oas2, oas3 } from "@stoplight/spectral-formats";
import { DiagnosticSeverity } from "@stoplight/types";
import parameterNamesUnique from "./functions/parameterNamesUnique";
import { truthy, falsy, schema } from "@stoplight/spectral-functions";

export default {
    extends: [],
    formats: [oas2, oas3],
    rules: {
        "aep-parameter-names-unique": {
            description: 'All parameter names for an operation should be case-insensitive unique.',
            message: '{{error}}',
            severity: DiagnosticSeverity.Warning,
            formats: [oas2, oas3],
            given: "$.paths[*]",
            then: {
                function: parameterNamesUnique
            }
        },
        "aep-request-body-optional": {
            description: "Flag optional request body -- common oversight.",
            message: "The body parameter is not marked as required.",
            severity: DiagnosticSeverity.Warning,
            formats: [oas3],
            given: ["$.paths[*].[put,post,patch].requestBody"],
            then: {
                field: "required",
                function: truthy
            }

        },
        /* AEP-132 */
        "aep-132-http-body": {
            description: "A list operation must not accept a request body.",
            severity: DiagnosticSeverity.Error,
            formats: [oas3],
            given: ["$.paths[*].get.requestBody"],
            then: {
                function: falsy
            }
        },
        /* AEP-135 */
        "aep-135-http-body": {
            description: "A delete operation must not accept a request body.",
            severity: DiagnosticSeverity.Error,
            formats: [oas3],
            given: ["$.paths[*].delete.requestBody"],
            then: {
                function: falsy
            }
        },
        "aep-135-response-204": {
            description: "A delete operation should have a 204 response.",
            message: "A delete operation should have a `204` response.",
            severity: DiagnosticSeverity.Warning,
            formats: [oas2, oas3],
            given: "$.paths[*].delete.responses",
            then: {
                function: schema,
                functionOptions: {
                    schema: {
                        oneOf: [
                            { required: ['204'] },
                            { required: ['202'] },
                        ]
                    }
                }
            }
        }
    }
}
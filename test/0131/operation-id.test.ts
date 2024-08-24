import { DiagnosticSeverity } from "@stoplight/types";
import testRule from "../utils";

testRule('aep-131-operation-id', [
    {
        name: 'should find no errors',
        document: {
            openapi: '3.0.3',
            paths: {
                '/{userId}': {
                    get: {
                        operationId: "getUser",
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
        name: 'should find errors',
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
                        operationId: "random",
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
        errors: [
            {
                message: "The operation ID does not conform to AEP-131",
                path: ["paths", "/{userId}", "get", "operationId"],
                severity: DiagnosticSeverity.Error
            }
        ]
    },
]);
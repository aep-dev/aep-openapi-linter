# Contributing

We'd love to accept your patches and contributions to this project.

## Issues

- You are welcome to [submit an issue] with a bug report or a feature request.
- If you are reporting a bug, please indicate which version of the package you
  are using and provide steps to reproduce the problem.
- If you are submitting a feature request, please indicate if you are willing
  or able to submit a PR for it.

[submit an issue]: https://github.com/aep-dev/aep-openapi-linter/issues

## Building and Testing

To build and test the project locally, clone the repo and issue the following
commands

```sh
npm install
npm test
```

### The example test

The input file for the `test/example/example.test.js` is taken from the
`aep/general/example.oas.yaml` from the [aep.dev repository]. Do not modify
this file directly in this repository. When a linting rule detects issues in
`examples/example.oas.yaml`:

1. **Confirm the issue is a true positive** - Verify the detected issue is a
   real violation of the AEP specification.
2. **Fix the issue upstream** - Open an issue in the [aep.dev repository]
   describing the problem in the canonical example file.
3. **Sync the updated file** - After the problem is corrected in the [aep.dev
   repository], copy the updated `aep/general/example.oas.yaml` to
   `examples/example.oas.yaml` in this repository. This ensures the example
   file remains synchronized with the official AEP documentation and avoids
   divergence between repositories.

[aep.dev repository]: https://github.com/aep-dev/aeps

## Adding new rules to the Spectral ruleset

When you add a new rule there are a number of places you should consider
including:

- `spectral.yaml` should define the new rule, possibly pointing to a new
  function used by the rule.
- `functions` directory to hold any new function for the rule.
- `test\<rulename>.test.js` should test at least the error and no-error cases
  of the rule.

## Coding conventions

Please adhere to the following conventions for code submitted to this project:

- Rules in the `spectral.yaml` ruleset file should start with "aep-" and be in
  alphabetical order.
- Functions and tests should follow the [Google JavaScript Style Guide].
- When a rule is a custom function, the function name should be the rule name
  minus the "aep-" prefix.
- Rule severity:
  - A rule for a **MUST** guideline in the AEPs or the OpenAPI specification
    should be `severity: error`
  - A rule for a **SHOULD** guideline in the AEPs or the OpenAPI specification
    should be `severity: warn`
  - Other rules may be either `severity: warn` or `severity: info`
  - Do not use `severity: hint` as it is not supported in the VSCode extension

[Google JavaScript Style Guide]:
  https://google.github.io/styleguide/jsguide.html

## Pull Request checklist

Please use the following checklist to minimize the PR review churn.

- Tests are included for any new rules
- All tests are passing
- Code coverage is > 80% for all custom functions
- Run `npm run lint` and `npm run lint:fix` if necessary to ensure code style

## Code of Conduct

This project's code of conduct can be found in the
[CODE_OF_CONDUCT.md file](https://github.com/aep-dev/aep-openapi-linter/blob/main/CODE_OF_CONDUCT.md)
(v1.4.0 of the [CoC](https://contributor-covenant.org/)).

## Contributor License Agreement

Contributions to this project must be accompanied by a Contributor License
Agreement. You (or your employer) retain the copyright to your contribution,
this simply gives us permission to use and redistribute your contributions as
part of the project. Head over to <https://cla.developers.google.com/> to see
your current agreements on file or to sign a new one.

You generally only need to submit a CLA once, so if you have already submitted
one (even if it was for a different project), you probably do not need to do it
again.

## Code reviews

All submissions, including submissions by project members, require review. We
use GitHub pull requests for this purpose. Consult
[GitHub Help](https://help.github.com/articles/about-pull-requests/) for more
information on using pull requests.

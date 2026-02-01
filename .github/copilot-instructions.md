# AEP OpenAPI Linter - Copilot Instructions

## Project Overview

This is a Spectral ruleset for linting OpenAPI documents to ensure compliance
with [API Enhancement Proposals (AEPs)](https://aep.dev). The linter checks
OpenAPI definitions against AEP standards for API design.

## Build, Test, and Lint Commands

```bash
# Install dependencies
npm install

# Run tests (full suite with coverage)
npm test

# Run a single test file
npx jest test/parameter-names-unique.test.js

# Run tests for a specific AEP
npx jest test/0131

# Run linter (Prettier + ESLint)
npm run lint

# Auto-fix linting issues
npm run lint-fix
```

## Architecture

### Structure

- **`spectral.yaml`** - Main ruleset that extends individual AEP rulesets and
  defines cross-cutting rules
- **`aep/*.yaml`** - Individual ruleset files, one per AEP number (e.g.,
  `0131.yaml` for AEP-131)
- **`functions/*.js`** - Custom Spectral functions for complex validation logic
  that cannot be expressed with built-in Spectral functions
- **`test/`** - Test files organized by rule or AEP number

**Note**: Custom functions should only be used when it is difficult or
impossible to express the rule with built-in Spectral functions (e.g.,
`schema`, `pattern`, `truthy`, `falsy`, `length`, etc.).

### Rule Organization

Each AEP ruleset file (`aep/XXXX.yaml`) contains:

- **Aliases** - Reusable JSONPath patterns (e.g., `GetOperation`,
  `ListOperation`)
- **Rules** - Individual validation rules with format
  `aep-{number}-{description}`

### Test Organization

Tests are organized in two ways:

1. **By rule name** - `test/{rule-name}.test.js` for cross-cutting rules
2. **By AEP number** - `test/{aep-number}/{rule-aspect}.test.js` for
   AEP-specific rules

Each test uses the `linterForRule` utility to test specific rules in isolation.

## Key Conventions

### Rule Naming and Severity

- Rules MUST be prefixed with `aep-` and listed alphabetically in
  `spectral.yaml`
- Custom function names MUST match the rule name minus the `aep-` prefix
- Rule severity mapping:
  - `error` - for AEP or OpenAPI **MUST** guidelines
  - `warn` - for AEP or OpenAPI **SHOULD** guidelines
  - `info` - for other helpful checks
  - Never use `hint` - not supported by VSCode extension

### Adding New Rules

When adding a new rule, create/update these four locations:

1. **Rule definition** - In `spectral.yaml` or appropriate `aep/XXXX.yaml` file
2. **Custom function** (if needed) - In `functions/{rule-name}.js`
3. **Tests** - In `test/{rule-name}.test.js` or
   `test/{aep-number}/{aspect}.test.js`
4. **Documentation** - In `docs/XXXX.md` (for AEP-specific rules) or
   `docs/rules.md` (for general rules)

### Testing Requirements

- Test at minimum: error case and no-error case for each rule
- Code coverage MUST be > 80% for all functions in `functions/*.js`
- Use the `linterForRule()` utility from `test/utils.js` to test rules in
  isolation
- Use custom matchers from `test/matchers.js` (e.g., `.toHaveNoViolations()`,
  `.toHaveViolation()`)

### Example File Sync

The `examples/example.oas.yaml` file is sourced from the upstream
[aep.dev repository](https://github.com/aep-dev/aeps) at
`aep/general/example.oas.yaml`. Do NOT modify it directly here. If the linter
detects issues:

1. Verify the issue is a true positive
2. Fix it upstream in the aep.dev repository
3. Copy the corrected version back to this repo

This keeps the example file synchronized with the canonical AEP documentation.

## Code Style

Follow the
[Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
for functions and tests.

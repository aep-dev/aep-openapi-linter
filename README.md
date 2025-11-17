# aep-openapi-linter

Linter for OpenAPI definitions to check compliance to [AEPs].

This repository contains a [Spectral](https://github.com/stoplightio/spectral)
ruleset to check an [OpenAPI] document for conformance to the [API Enhancement
Proposals].

[AEPs]: https://aep.dev
[API Enhancement Proposals]: https://aep.dev
[OpenAPI]: https://www.openapis.org/

## How to use the aep-openapi-linter

### Dependencies

The Spectral Ruleset requires Node version 20 or later.

### Install Spectral

`npm i @stoplight/spectral-cli -g`

### Usage

You can specify the ruleset directly on the command line:

`spectral lint -r https://raw.githubusercontent.com/aep-dev/aep-openapi-linter/main/spectral.yaml <api definition file>`

Or you can create a Spectral configuration file (`.spectral.yaml`) that
references the ruleset:

```yaml
extends:
  - https://raw.githubusercontent.com/aep-dev/aep-openapi-linter/main/spectral.yaml
```

### Example

```bash
spectral lint -r https://raw.githubusercontent.com/aep-dev/aep-openapi-linter/main/spectral.yaml petstore.yaml
```

### Using the Spectral VSCode extension

There is a
[Spectral VSCode extension](https://marketplace.visualstudio.com/items?itemName=stoplight.spectral)
that will run the Spectral linter on an open API definition file and show
errors right within VSCode. You can use this ruleset with the Spectral VSCode
extension.

1. Install the Spectral VSCode extension from the extensions tab in VSCode.
2. Create a Spectral configuration file (`.spectral.yaml`) in the root
   directory of your project as shown above.
3. Set `spectral.rulesetFile` to the name of this configuration file in your
   VSCode settings.

Now when you open an OpenAPI document in this project, it should highlight
lines with errors. You can also get a full list of problems in the file by
opening the "Problems panel" with "View / Problems". In the Problems panel you
can filter to show or hide errors, warnings, or infos.

## Contributing

See [CONTRIBUTING](./CONTRIBUTING.md) for more details.

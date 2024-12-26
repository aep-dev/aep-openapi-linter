const fs = require('fs');
const path = require('path');
const { Document } = require('@stoplight/spectral-core');
const Parsers = require('@stoplight/spectral-parsers');

const { linterForRuleset } = require('../utils');

const aepRulesetFile = './spectral.yaml';

test('aep-linter should find no errors in example', async () => {
  const examplePath = path.join(__dirname, '../../examples/example.oas.yaml');
  const myDocument = new Document(
    fs.readFileSync(examplePath, 'utf-8').trim(),
    Parsers.Yaml,
    'example.oas.yaml'
  );
  const linter = await linterForRuleset(aepRulesetFile);
  return linter.run(myDocument).then((results) => {
    expect(results.length).toBe(0);
  });
});

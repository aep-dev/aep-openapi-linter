#!/usr/bin/env node
// Validates spectral.yaml and aep/*.yaml against the remote Spectral ruleset
// JSON schema so authoring mistakes are caught in CI.

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv2020 = require('ajv/dist/2020');
const addFormats = require('ajv-formats');

const SCHEMA_URL = 'https://spec.spotlight-rules.com/schema/v1/spectral-ruleset.schema.json';

const ROOT = path.join(__dirname, '..');
const FILES = [
  'spectral.yaml',
  ...fs
    .readdirSync(path.join(ROOT, 'aep'))
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => path.join('aep', f)),
];

async function main() {
  const res = await fetch(SCHEMA_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch ruleset schema: ${res.status} ${res.statusText}`);
  }
  const schema = await res.json();

  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  let hasErrors = false;
  FILES.forEach((file) => {
    const fullPath = path.join(ROOT, file);
    const doc = yaml.load(fs.readFileSync(fullPath, 'utf8'));
    if (!validate(doc)) {
      hasErrors = true;
      console.error(`\n${file} failed schema validation:`);
      validate.errors.forEach((err) => {
        console.error(`  ${err.instancePath || '/'} ${err.message}`);
      });
    } else {
      console.log(`${file}: OK`);
    }
  });

  if (hasErrors) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});

const { Spectral } = require('@stoplight/spectral-core');
const { migrateRuleset } = require('@stoplight/spectral-ruleset-migrator');
const fs = require('fs');

const AsyncFunction = (async () => {}).constructor;

async function linterForRuleset(rulesetFile) {
  const linter = new Spectral();

  const m = {};
  const paths = [__dirname, '..', '../..'];
  await AsyncFunction(
    'module, require',
    await migrateRuleset(rulesetFile, {
      format: 'commonjs',
      fs,
    })
    // eslint-disable-next-line import/no-dynamic-require,global-require
  )(m, (text) => require(require.resolve(text, { paths })));
  const ruleset = m.exports;
  linter.setRuleset(ruleset);
  return linter;
}

async function linterForRule(rule) {
  const rulesetFile = './spectral.yaml';
  const linter = await linterForRuleset(rulesetFile);
  const { ruleset } = linter;
  delete ruleset.extends;
  Object.keys(ruleset.rules).forEach((key) => {
    if (key !== rule) {
      delete ruleset.rules[key];
    }
  });
  linter.setRuleset(ruleset);
  return linter;
}

async function linterForAepRule(aep, rule) {
  const rulesetFile = `./aep/${aep}.yaml`;
  const linter = await linterForRuleset(rulesetFile);
  const { ruleset } = linter;
  delete ruleset.extends;
  Object.keys(ruleset.rules).forEach((key) => {
    if (key !== rule) {
      delete ruleset.rules[key];
    }
  });
  linter.setRuleset(ruleset);
  return linter;
}

module.exports.linterForRuleset = linterForRuleset;
module.exports.linterForRule = linterForRule;
module.exports.linterForAepRule = linterForAepRule;

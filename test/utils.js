const { Spectral } = require('@stoplight/spectral-core');
const { migrateRuleset } = require('@stoplight/spectral-ruleset-migrator');
const fs = require('fs');

const AsyncFunction = (async () => {}).constructor;

const rulesetFile = './spectral.yaml';

async function linterForRule(rule) {
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
  const linter = new Spectral();

  const aepRulesetFile = `./aep/${aep}.yaml`;

  const m = {};
  const paths = [__dirname, '..', '../..'];
  await AsyncFunction(
    'module, require',
    await migrateRuleset(aepRulesetFile, {
      format: 'commonjs',
      fs,
    })
    // eslint-disable-next-line import/no-dynamic-require,global-require
  )(m, (text) => require(require.resolve(text, { paths })));
  const ruleset = m.exports;
  delete ruleset.extends;
  Object.keys(ruleset.rules).forEach((key) => {
    if (key !== rule) {
      delete ruleset.rules[key];
    }
  });
  linter.setRuleset(ruleset);
  return linter;
}

module.exports.linterForRule = linterForRule;
module.exports.linterForAepRule = linterForAepRule;

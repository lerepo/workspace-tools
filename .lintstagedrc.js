const { CLIEngine } = require('eslint');

const cli = new CLIEngine({});

const lintIfNotIgnored = (files) =>
  'eslint --max-warnings=0 --ignore-path .gitignore ' +
  files.filter((file) => !cli.isPathIgnored(file)).join(' ');

module.exports = {
  '*': ['prettier --write'],
  '*.{j,t}s?(x)': lintIfNotIgnored,
  '*.{md,mkdn,mdown,markdown}': lintIfNotIgnored,
  '*.json': lintIfNotIgnored
};


const ChildProcess = require('../src/cp');
const path = require('path');

const workingDirectory = path.resolve(__dirname, '../jsdoc');
const cp = new ChildProcess({ workingDirectory });

cp.spawn('git', ['init']).then(() => {
  return cp.spawn(
    'git',
    [
      'remote',
      'add',
      'origin',
      'git@github.com:coreyferguson/dev-env-lib.git'
    ]
  );
}).then(res => {
  console.log(res.output);
  return cp.spawn('git', ['fetch', 'origin']);
}).then(res => {
  console.log(res.output);
  return cp.spawn('git', ['add', '.']);
}).then(res => {
  console.log(res.output);
  return cp.spawn('git', ['ci', '-m', "docs"]);
}).then(res => {
  console.log(res.output);
  return cp.spawn('git', ['co', '-b', 'gh-pages']);
}).then(res => {
  console.log(res.output);
  return cp.spawn('git', ['push', '-fu', 'origin', 'gh-pages']);
}).catch(err => {
  console.error('err:', err);
});


const cp = require('../src/cp');
const path = require('path');

const cwd = [__dirname, '../jsdoc'];

cp.spawn({
  cwd,
  command: 'git',
  args: ['init']
}).then(() => {
  return cp.spawn({
    cwd,
    command: 'git',
    args: [
      'remote',
      'add',
      'origin',
      'git@github.com:coreyferguson/dev-env-lib.git'
    ]
  });
}).then(res => {
  console.log(res.output);
  return cp.spawn({
    cwd,
    command: 'git',
    args: ['fetch', 'origin']
  });
}).then(res => {
  console.log(res.output);
  return cp.spawn({
    cwd,
    command: 'git',
    args: ['add', '.']
  });
}).then(res => {
  console.log(res.output);
  return cp.spawn({
    cwd,
    command: 'git',
    args: ['ci', '-m', "docs"]
  });
}).then(res => {
  console.log(res.output);
  return cp.spawn({
    cwd,
    command: 'git',
    args: ['co', '-b', 'gh-pages']
  });
}).then(res => {
  console.log(res.output);
  return cp.spawn({
    cwd,
    command: 'git',
    args: ['push', '-fu', 'origin', 'gh-pages']
  });
}).catch(err => {
  console.error('err:', err);
});

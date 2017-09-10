
const cp = require('../src/cp');
const winston = require('winston');

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
  winston.log('info', res.output);
  return cp.spawn({
    cwd,
    command: 'git',
    args: ['fetch', 'origin']
  });
}).then(res => {
  winston.log('info', res.output);
  return cp.spawn({
    cwd,
    command: 'git',
    args: ['add', '.']
  });
}).then(res => {
  winston.log('info', res.output);
  return cp.spawn({
    cwd,
    command: 'git',
    args: ['ci', '-m', 'docs']
  });
}).then(res => {
  winston.log('info', res.output);
  return cp.spawn({
    cwd,
    command: 'git',
    args: ['co', '-b', 'gh-pages']
  });
}).then(res => {
  winston.log('info', res.output);
  return cp.spawn({
    cwd,
    command: 'git',
    args: ['push', '-fu', 'origin', 'gh-pages']
  });
}).catch(err => {
  winston.log('error', err);
});

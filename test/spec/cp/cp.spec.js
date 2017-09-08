
const path = require('path');
const cp = require('../../../src/cp');
const { expect } = require('../../util/test');

describe('cp unit tests', () => {

  it('spawn command, workingDirectory from path segments', () => {
    return cp.spawn({
      cwd: [__dirname, 'workingDirectory'],
      command: 'ls'
    }).then(response => {
      expect(response.code).to.equal(0);
      expect(response.stdout).to.match(/one\.txt/);
      expect(response.stdout).to.match(/two\.txt/);
      expect(response.stdout).to.not.match(/ls/);
      expect(response.output).to.eql(response.stdout);
      expect(response.stderr).to.be.equal('');
    });
  });

  it('spawn command, workingDirectory from absolute path', () => {
    return cp.spawn({
      cwd: path.resolve(__dirname, 'workingDirectory'),
      command: 'ls'
    }).then(response => {
      expect(response.code).to.equal(0);
      expect(response.stdout).to.match(/one\.txt/);
    });
  });

  it('spawn command, w/ args', () => {
    return cp.spawn({
      cwd: [__dirname, 'workingDirectory'],
      command: 'ls',
      args: ['-l']
    }).then(response => {
      expect(response.code).to.equal(0);
      expect(response.stdout).to.match(/[rwe-]{10}.+one\.txt/);
      expect(response.stderr).to.be.equal('');
    });
  });

  it('spawn command, nodeSpawnOptions.cwd overrides cwd', () => {
    return cp.spawn({
      cwd: [__dirname, 'workingDirectory'],
      command: 'ls',
      nodeSpawnOptions: { cwd: __dirname }
    }).then(response => {
      expect(response.code).to.equal(0);
      expect(response.stdout).to.match(/cp.spec.js/);
      expect(response.stderr).to.be.equal('');
    });
  });

  it('spawnTemplate command from path segments', () => {
    return cp.spawnTemplate({
      cwd: [__dirname, 'workingDirectory'],
      templatePath: [__dirname, 'templates/ls'],
    }).then(response => {
      expect(response.code).to.eql(0);
      expect(response.stdout).to.match(/one\.txt/);
      expect(response.stdout).to.match(/two\.txt/);
      expect(response.stdout).to.not.match(/ls/);
    });
  });

  it('spawnTemplate command from absolute path', () => {
    return cp.spawnTemplate({
      cwd: path.resolve(__dirname, 'workingDirectory'),
      templatePath: [__dirname, 'templates/ls'],
    }).then(response => {
      expect(response.code).to.eql(0);
      expect(response.stdout).to.match(/one\.txt/);
    });
  });

  it('spawnTemplate command, w/ model', () => {
    return cp.spawnTemplate({
      cwd: [__dirname, 'workingDirectory'],
      templatePath: [__dirname, 'templates/find'],
      model: { name: 'one\.txt' }
    }).then(response => {
      expect(response.code).to.eql(0);
      expect(response.stdout).to.match(/one\.txt/);
    });
  });

  it('spawnTemplate command, w/ model, w/ options', () => {
    return cp.spawnTemplate({
      cwd: [__dirname, 'workingDirectory'],
      templatePath: [__dirname, 'templates/find'],
      model: { name: 'one.txt' },
      nodeSpawnOptions: { cwd: __dirname }
    }).then(response => {
      expect(response.code).to.eql(0);
      expect(response.stdout).to.match(/\.\/workingDirectory\/one\.txt/);
    });
  });

});


const path = require('path');
const ChildProcess = require('../../../src/cp');
const { expect } = require('../../util/test');

describe('cp unit tests', () => {

  let cp;

  before(() => {
    cp = new ChildProcess({
      workingDirectory: path.resolve(__dirname, 'workingDirectory')
    });
  });

  it('spawn command, w/o args', () => {
    return cp.spawn('ls').then(response => {
      expect(response.code).to.equal(0);
      expect(response.stdout).to.match(/ls\.template/);
      expect(response.output).to.eql(response.stdout);
      expect(response.stderr).to.be.equal('');
    });
  });

  it('spawn command, w/ args', () => {
    return cp.spawn('ls', ['-l']).then(response => {
      expect(response.code).to.equal(0);
      expect(response.stdout).to.match(/[rwe-]{10}.+ls\.template/);
      expect(response.stderr).to.be.equal('');
    });
  });

  it('spawn command, w/o args, w/ options', () => {
    return cp.spawn('ls', [], { cwd: __dirname }).then(response => {
      expect(response.code).to.equal(0);
      expect(response.stdout).to.match(/cp.unit.js/);
      expect(response.stderr).to.be.equal('');
    });
  });

  it('spawn command, w/ args, w/ options', () => {
    return cp.spawn('ls', ['-l'], { cwd: __dirname }).then(response => {
      expect(response.code).to.equal(0);
      expect(response.stdout).to.match(/[rwe-]{10}.+cp\.unit\.js/);
      expect(response.stderr).to.be.equal('');
    });
  });

  it('spawnTemplate command, w/o model', () => {
    return cp.spawnTemplate('ls.template').then(response => {
      expect(response.code).to.eql(0);
      expect(response.stdout).to.match(/ls.template/);
    });
  });

  it('spawnTemplate command, w/ model', () => {
    return cp.spawnTemplate('find.template', { name: 'ls.template' }).then(response => {
      expect(response.code).to.eql(0);
      expect(response.stdout).to.match(/ls\.template/);
    });
  });

  it('spawnTemplate command, w/ model, w/ options', () => {
    return cp.spawnTemplate(
      'find.template',
      { name: 'ls.template' },
      { cwd: __dirname }
    ).then(response => {
      expect(response.code).to.eql(0);
      expect(response.stdout).to.match(/\.\/workingDirectory\/ls\.template/);
    });
  });

});

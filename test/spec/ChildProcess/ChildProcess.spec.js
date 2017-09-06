
const path = require('path');
const ChildProcess = require('../../../src/ChildProcess');
const { expect } = require('../../util/test');

describe('ChildProcess unit tests', () => {

  const defaultOptions = {
    workingDirectory: path.resolve(__dirname, 'workingDirectory'),
    sourceDirectory: path.resolve(__dirname, 'sourceDirectory')
  };
  let cp = new ChildProcess(defaultOptions);

  it('ChildProcess constructor missing workingDirectory', () => {
    const options = Object.assign({}, defaultOptions);
    delete options.workingDirectory;
    expect(() => new ChildProcess(options)).to.throw(/workingDirectory/);
  });

  it('ChildProcess missing sourceDirectory', () => {
    const options = Object.assign({}, defaultOptions);
    delete options.sourceDirectory;
    expect(() => new ChildProcess(options)).to.throw(/sourceDirectory/);
  });

  it('spawn command, w/o args', () => {
    return cp.spawn('ls').then(response => {
      expect(response.code).to.equal(0);
      expect(response.stdout).to.match(/one\.txt/);
      expect(response.stdout).to.match(/two\.txt/);
      expect(response.stdout).to.not.match(/ls\.template/);
      expect(response.output).to.eql(response.stdout);
      expect(response.stderr).to.be.equal('');
    });
  });

  it('spawn command, w/ args', () => {
    return cp.spawn('ls', ['-l']).then(response => {
      expect(response.code).to.equal(0);
      expect(response.stdout).to.match(/[rwe-]{10}.+one\.txt/);
      expect(response.stderr).to.be.equal('');
    });
  });

  it('spawn command, w/o args, w/ options', () => {
    return cp.spawn('ls', [], { cwd: __dirname }).then(response => {
      expect(response.code).to.equal(0);
      expect(response.stdout).to.match(/ChildProcess.spec.js/);
      expect(response.stderr).to.be.equal('');
    });
  });

  it('spawn command, w/ args, w/ options', () => {
    return cp.spawn('ls', ['-l'], { cwd: __dirname }).then(response => {
      expect(response.code).to.equal(0);
      expect(response.stdout).to.match(/[rwe-]{10}.+ChildProcess\.spec\.js/);
      expect(response.stderr).to.be.equal('');
    });
  });

  it('spawnTemplate command, w/o model', () => {
    return cp.spawnTemplate('ls.template').then(response => {
      expect(response.code).to.eql(0);
      expect(response.stdout).to.match(/one\.txt/);
      expect(response.stdout).to.match(/two\.txt/);
      expect(response.stdout).to.not.match(/ls\.template/);
    });
  });

  it('spawnTemplate command, w/ model', () => {
    return cp.spawnTemplate('find.template', { name: 'one\.txt' }).then(response => {
      expect(response.code).to.eql(0);
      expect(response.stdout).to.match(/one\.txt/);
    });
  });

  it('spawnTemplate command, w/ model, w/ options', () => {
    return cp.spawnTemplate(
      'find.template',
      { name: 'one.txt' },
      { cwd: __dirname }
    ).then(response => {
      expect(response.code).to.eql(0);
      expect(response.stdout).to.match(/\.\/workingDirectory\/one\.txt/);
    });
  });

});

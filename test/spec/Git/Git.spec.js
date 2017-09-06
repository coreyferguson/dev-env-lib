
const ChildProcess = require('../../../src/ChildProcess');
const Git = require('../../../src/Git');
const path = require('path');
const { expect } = require('../../util/test');

const workingDirectory = path.resolve(__dirname, 'workingDirectory');
const sourceDirectory = workingDirectory;
const cp = new ChildProcess({ workingDirectory, sourceDirectory });

describe('Git unit tests', function() {

  this.timeout(5000);

  afterEach(() => {
    return cp.spawn('rm', ['-fr', 'dev-env-lib-name']);
  });

  it('Git constructor missing workingDirectory', () => {
    expect(() => new Git()).to.throw(/workingDirectory/);
  });

  it('clone success', () => {
    const git = new Git({ workingDirectory });
    return git.clone(
      'dev-env-lib-name',
      'git@github.com:coreyferguson/dev-env-lib.git',
      'testBranch'
    ).then(() => {
      return cp.spawn('ls');
    }).then(response => {
      expect(response.stdout).to.match(/dev-env-lib-name/);
    }).then(() => {
      return cp.spawn('git', ['st'], {
        cwd: path.resolve(workingDirectory, 'dev-env-lib-name')
      });
    }).then(response => {
      expect(response.stdout).to.match(/On branch testBranch/);
      expect(response.stdout).to.match(/Your branch is up-to-date/);
    });
  });

  it('clone no such repository', () => {
    const git = new Git({ workingDirectory });
    const promise = git.clone(
      'dev-env-lib-name',
      'git@github.com:coreyferguson/dev-env-lib-doesnt-exist.git',
      'testBranch'
    );
    return Promise.all([
      expect(promise).to.eventually.be.rejected,
      promise.catch(response => {
        expect(response.stderr).to.match(/Repository not found/);
      })
    ]);
  });

  it('clone no such branch', () => {
    const git = new Git({ workingDirectory });
    const promise = git.clone(
      'dev-env-lib-name',
      'git@github.com:coreyferguson/dev-env-lib.git',
      'no-such-branch'
    );
    return Promise.all([
      expect(promise).to.eventually.be.rejected,
      promise.catch(response => {
        expect(response.stderr).to.match(/did not match any file\(s\) known to git/);
      })
    ]);
  });

})

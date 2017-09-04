
const ChildProcess = require('../../../src/cp');
const Git = require('../../../src/git');
const path = require('path');
const { expect } = require('../../util/test');

const workingDirectory = path.resolve(__dirname, 'workingDirectory');
const cp = new ChildProcess({ workingDirectory });

describe('git e2e tests', function() {

  this.timeout(5000);

  afterEach(() => {
    return cp.spawn('rm', ['-fr', 'dev-cli-name']);
  });

  it('clone success', () => {
    const git = new Git({ workingDirectory });
    return git.clone(
      'dev-cli-name',
      'git@github.com:coreyferguson/dev-cli.git',
      'testBranch'
    ).then(() => {
      return cp.spawn('ls');
    }).then(response => {
      expect(response.stdout).to.match(/dev-cli-name/);
    }).then(() => {
      return cp.spawn('git', ['st'], {
        cwd: path.resolve(workingDirectory, 'dev-cli-name')
      });
    }).then(response => {
      expect(response.stdout).to.match(/On branch testBranch/);
      expect(response.stdout).to.match(/Your branch is up-to-date/);
    });
  });

  it('clone no such repository', () => {
    const git = new Git({ workingDirectory });
    const promise = git.clone(
      'dev-cli-name',
      'git@github.com:coreyferguson/dev-cli-doesnt-exist.git',
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
      'dev-cli-name',
      'git@github.com:coreyferguson/dev-cli.git',
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

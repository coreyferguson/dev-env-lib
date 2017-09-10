
const cp = require('../../../src/cp');
const git = require('../../../src/git');
const { expect } = require('../../util/test');

const cwd = [__dirname, 'workingDirectory'];

describe('git unit tests', function() {

  this.timeout(5000);

  afterEach(() => {
    return cp.spawn({
      cwd,
      command: 'rm',
      args: ['-fr', 'dev-env-lib-name']
    });
  });

  it('clone success', () => {
    return git.clone({
      cwd,
      name: 'dev-env-lib-name',
      repository: 'git@github.com:coreyferguson/dev-env-lib.git',
      branch: 'testBranch'
    }).then(() => {
      return cp.spawn({
        cwd,
        command: 'ls'
      });
    }).then(response => {
      expect(response.stdout).to.match(/dev-env-lib-name/);
    }).then(() => {
      return cp.spawn({
        cwd: [...cwd, 'dev-env-lib-name'],
        command: 'git',
        args: ['st'],
      });
    }).then(response => {
      expect(response.stdout).to.match(/On branch testBranch/);
      expect(response.stdout).to.match(/Your branch is up-to-date/);
    });
  });

  it('clone no such repository', () => {
    const promise = git.clone({
      cwd,
      name: 'dev-env-lib-name',
      repository: 'git@github.com:coreyferguson/dev-env-lib-doesnt-exist.git',
      branch: 'testBranch'
    });
    return Promise.all([
      expect(promise).to.eventually.be.rejected,
      promise.catch(response => {
        expect(response.stderr).to.match(/Repository not found/);
      })
    ]);
  });

  it('clone no such branch', () => {
    const promise = git.clone({
      cwd,
      name: 'dev-env-lib-name',
      repository: 'git@github.com:coreyferguson/dev-env-lib.git',
      branch: 'no-such-branch'
    });
    return Promise.all([
      expect(promise).to.eventually.be.rejected,
      promise.catch(response => {
        expect(response.stderr).to.match(/did not match any file\(s\) known to git/);
      })
    ]);
  });

  it('clone, repo already exists', () => {
    return git.clone({
      cwd,
      name: 'dev-env-lib-name',
      repository: 'git@github.com:coreyferguson/dev-env-lib.git',
      branch: 'testBranch'
    }).then(() => {
      return git.clone({
        cwd,
        name: 'dev-env-lib-name',
        repository: 'git@github.com:coreyferguson/dev-env-lib.git',
        branch: 'testBranch'
      });
    });
  });

});


const cp = require('../cp');
const path = require('path');

/**
 * Git utilities.
 * @namespace git
 * @example
 * const { git } = require('dev-env-lib');
 */
class Git {

  /**
   * Clone a git repository.
   * @memberOf git
   * @function clone
   * @param {cp~PathSegments} options.cwd - working directory
   * @param {string} options.name - name of folder created by git clone
   * @param {string} options.repository - clone url to git repository
   * @param {string} options.branch - name of branch to checkout by default
   * @returns {cp~AggregatedOutput} aggregated output
   */
  clone(options) {
    const name = options.name;
    const repository = options.repository;
    const branch = options.branch;
    let cwd = options.cwd;
    if (!cwd) return Promise.reject(
      new Error('Missing required option: cwd'));
    if (cwd instanceof Array) {
      cwd = cwd.reduce((agg, value) => path.resolve(agg, value));
    }
    return this._clone(cwd, name, repository).then(() => {
      return this._checkout(cwd, name, branch);
    }).catch(result => {
      // ignore "directory already exists" error
      if (!/not an empty directory/.test(result.stderr)) throw result;
    });
  }

  _clone(cwd, name, repository) {
    return cp.spawnTemplate({
      cwd,
      templatePath: [__dirname, 'templates/git-clone'],
      model: { name, repository }
    });
  }

  _checkout(cwd, name, branch) {
    return cp.spawnTemplate({
      cwd: [cwd, name],
      templatePath: [__dirname, 'templates/git-checkout-branch'],
      model: { name, branch }
    });
  }

}

module.exports = new Git();
module.exports.Git = Git;

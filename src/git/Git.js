
const ChildProcess = require('../cp/ChildProcess');
const path = require('path');

/**
 * @memberOf dev
 * @namespace git
 */

class Git {

  constructor(options) {
    // required - workingDirectory
    options = options || {};
    const { workingDirectory } = options;
    if (workingDirectory === undefined) {
      throw new Error('Missing required option: workingDirectory');
    }
    this._workingDirectory = workingDirectory;
    this._cp = new ChildProcess({ workingDirectory })
    this._path = options.path || path;
  }

  /**
   * Clone a git repository.
   * @memberOf dev.git
   * @function clone
   * @param {string} name - name of folder created by git clone
   * @param {string} repository - clone url to git repository
   * @param {string} branch - name of branch to checkout by default
   * @returns {dev.cp~AggregatedOutput} aggregated output
   */
  clone(name, repository, branch) {
    return this._clone(name, repository).then(() => {
      return this._checkout(name, branch);
    });
  }

  _clone(name, repository) {
    const template = this._path.resolve(__dirname, 'templates/git-clone');
    return this._cp.spawnTemplate(template, {
      name, repository
    });
  }

  _checkout(name, branch) {
    const template = this._path.resolve(__dirname, 'templates/git-checkout-branch');
    const cwd = path.resolve(this._workingDirectory, name);
    return this._cp.spawnTemplate(
      template,
      { name, branch },
      { cwd }
    );
  }

}

module.exports = Git;

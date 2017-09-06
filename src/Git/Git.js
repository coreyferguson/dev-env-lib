
const ChildProcess = require('../ChildProcess');
const path = require('path');

/**
 * Git utilities.
 */
class Git {

  /**
   * @param {string} workingDirectory - Default working directory when running Git commands.
   */
  constructor(options) {
    options = options || {};
    const { workingDirectory } = options;
    if (workingDirectory === undefined) {
      throw new Error('Missing required option: workingDirectory');
    }
    this._workingDirectory = workingDirectory;
    this._cp = new ChildProcess({
      workingDirectory: options.workingDirectory,
      sourceDirectory: __dirname
    });
  }

  /**
   * Clone a git repository.
   * @param {string} name - name of folder created by git clone
   * @param {string} repository - clone url to git repository
   * @param {string} branch - name of branch to checkout by default
   * @returns {ChildProcess~AggregatedOutput} aggregated output
   */
  clone(name, repository, branch) {
    return this._clone(name, repository).then(() => {
      return this._checkout(name, branch);
    });
  }

  _clone(name, repository) {
    return this._cp.spawnTemplate('templates/git-clone', { name, repository });
  }

  _checkout(name, branch) {
    const template = path.resolve(__dirname, 'templates/git-checkout-branch');
    const cwd = path.resolve(this._workingDirectory, name);
    return this._cp.spawnTemplate(
      template,
      { name, branch },
      { cwd }
    );
  }

}

module.exports = Git;

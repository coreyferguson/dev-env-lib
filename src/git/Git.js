
const ChildProcess = require('../cp/ChildProcess');
const path = require('path');

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

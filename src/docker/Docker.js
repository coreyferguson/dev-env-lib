
const ChildProcess = require('../cp');
const path = require('path');

class Docker {

  constructor(options) {
    options = options || {};
    this._path = options.path || path;
    this._workingDirectory = options.workingDirectory;
    this._cp = new ChildProcess({ workingDirectory: __dirname });
  }

  buildImage(dockerfilePath, name) {
    // convert relative path to absolute path
    const dockerFileAbsolutePath = this._path.resolve(
      this._workingDirectory, dockerfilePath);
    return this._cp.spawnTemplate('templates/buildImage', {
      dockerFileAbsolutePath,
      name
    });
  }

  removeImage(name) {
    return this._cp.spawnTemplate(
      'templates/removeImage',
      { name }
    ).catch(err => {
      if (err.code !== 1) throw new Error(err);
    });
  }

  imageExists(name) {
    return this._cp.spawnTemplate(
      'templates/getImage',
      { name }
    ).then(response => {
      return /dev-cli-test-docker/.test(response.stdout);
    });
  }
}

module.exports = Docker;

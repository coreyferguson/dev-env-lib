
const ChildProcess = require('../cp');
const path = require('path');

/**
 * @memberOf dev
 * @namespace docker
 */

class Docker {

  constructor(options) {
    options = options || {};
    this._path = options.path || path;
    this._workingDirectory = options.workingDirectory;
    this._cp = new ChildProcess({ workingDirectory: __dirname });
  }

  /**
   * Build docker image.
   * @memberOf dev.docker
   * @function buildImage
   * @param {string} dockerfilePath - Relative or absolute path to Dockerfile
   * @param {string} name - Name of docker image
   * @returns {dev.cp~AggregatedOutput} aggregated output
   */
  buildImage(dockerfilePath, name) {
    // convert relative path to absolute path
    const dockerFileAbsolutePath = this._path.resolve(
      this._workingDirectory, dockerfilePath);
    return this._cp.spawnTemplate('templates/buildImage', {
      dockerFileAbsolutePath,
      name
    });
  }

  /**
   * Remove docker image.
   * @memberOf dev.docker
   * @function removeImage
   * @param {string} name - Name of docker image
   * @returns {dev.cp~AggregatedOutput} aggregated output
   */
  removeImage(name) {
    return this._cp.spawnTemplate(
      'templates/removeImage',
      { name }
    ).catch(err => {
      if (err.code !== 1) throw new Error(err);
      else return err;
    });
  }

  /**
   * Check if a docker image already exists.
   * @memberOf dev.docker
   * @function imageExists
   * @param {string} name - Name of docker image
   * @returns {boolean} existance of docker image
   */
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

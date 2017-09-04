
const ChildProcess = require('../cp');
const path = require('path');
const spawn = require('child_process').spawn;

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
      return /dev-env-lib-test-docker/.test(response.stdout);
    });
  }

  /**
   * Create a virtual network with docker.
   * @memberOf dev.docker
   * @function createNetwork
   * @param {string} name - Name of docker image
   * @returns {dev.cp~AggregatedOutput} aggregated output
   */
  createNetwork(name) {
    return this._cp.spawnTemplate(
      'templates/createNetwork',
      { name }
    ).catch(err => {
      if (err.code !== 1) throw new Error(err);
      else return err;
    });
  }

  /**
   * Remove a virtual network with docker.
   * @memberOf dev.docker
   * @function removeNetwork
   * @param {string} name - Name of docker image
   * @returns {dev.cp~AggregatedOutput} aggregated output
   */
  removeNetwork(name) {
    return this._cp.spawnTemplate(
      'templates/removeNetwork',
      { name }
    ).catch(err => {
      if (err.code !== 1) throw new Error(err);
      else return err;
    });
  }

  /**
   * Remove a docker container.
   * @memberOf dev.docker
   * @function removeContainer
   * @param {string} name - Name of docker container
   * @returns {dev.cp~AggregatedOutput} aggregated output
   */
  removeContainer(name) {
    return this._cp.spawnTemplate(
      'templates/removeContainer',
      { name }
    ).catch(err => {
      if (err.code !== 1) throw new Error(err);
      else return err;
    });
  }

  /**
   * Tail the logs of a container until output matches the given regex.
   * @memberOf dev.docker
   * @function waitForContainerOutput
   * @param {string} name - Name of docker container
   * @param {RegExp} regex - regex to match in output
   */
  waitForContainerOutput(name, regex) {
    return new Promise((resolve, reject) => {
      const cp = spawn('docker', ['logs', '-f', name]);
      function testData(data) {
        if (regex.test(data.toString())) {
          cp.kill('SIGINT');
          resolve();
        }
      }
      cp.stderr.on('data', testData);
      cp.stdout.on('data', testData);
      cp.on('close', code => {
        reject(new Error('stdio closed without matching regex. code: ' + code));
      });
    });
  }

}

module.exports = Docker;

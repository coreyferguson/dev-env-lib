
const ChildProcess = require('../ChildProcess');
const path = require('path');
const spawn = require('child_process').spawn;

/**
 * Docker utilities.
 */
class Docker {

  /**
   * @param {string} workingDirectory - Default working directory when running docker commands.
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
   * Build docker image.
   * @param {string} dockerfilePath - Absolute or relative (to workingDirectory) path to Dockerfile
   * @param {string} name - Name of docker image
   * @returns {ChildProcess~AggregatedOutput} aggregated output
   */
  buildImage(dockerfilePath, name) {
    // convert relative path to absolute path
    const dockerFileAbsolutePath = path.resolve(
      this._workingDirectory, dockerfilePath);
    return this._cp.spawnTemplate('templates/buildImage', {
      dockerFileAbsolutePath,
      name
    });
  }

  /**
   * Remove docker image.
   * @param {string} name - Name of docker image
   * @returns {ChildProcess~AggregatedOutput} aggregated output
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
   * @param {string} name - Name of docker image
   * @returns {ChildProcess~AggregatedOutput} aggregated output
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
   * @param {string} name - Name of docker image
   * @returns {ChildProcess~AggregatedOutput} aggregated output
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
   * @param {string} name - Name of docker container
   * @returns {ChildProcess~AggregatedOutput} aggregated output
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

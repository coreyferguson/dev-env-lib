
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * @memberOf dev
 * @namespace yaml
 */

class Yaml {

  constructor(options) {
    options = options || {};
    this._workingDirectory = options.workingDirectory;
    this._fs = options.fs || fs;
    this._path = options.path || path;
    this._yaml = options.yaml || yaml;
  }

  /**
   * Load a yaml file into JavaScript object.
   * @memberOf dev.yaml
   * @function load
   * @param {string} ymlPath - Relative or absolute path to yaml file.
   * @returns {Object} yaml file properties
   */
  load(ymlPath) {
    const absolutePath = this._path.resolve(this._workingDirectory, ymlPath);
    return this._yaml.safeLoad(this._fs.readFileSync(absolutePath, 'utf8'));
  }

}

module.exports = Yaml;

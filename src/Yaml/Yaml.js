
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Yaml/JSON conversion.
 */
class Yaml {

  /**
   * @param {string} sourceDirectory - Source directory used when resolving yaml files.
   */
  constructor(options) {
    options = options || {};
    const { sourceDirectory } = options;
    if (sourceDirectory === undefined) {
      throw new Error('Missing required option: sourceDirectory');
    }
    this._sourceDirectory = sourceDirectory;
  }

  /**
   * Load a yaml file into JavaScript object.
   * @param {string} ymlPath - Absolute or relative (to sourceDirectory) path to yaml file.
   * @returns {Object} yaml file properties
   */
  load(ymlPath) {
    const absolutePath = path.resolve(this._sourceDirectory, ymlPath);
    return yaml.safeLoad(fs.readFileSync(absolutePath, 'utf8'));
  }

}

module.exports = Yaml;

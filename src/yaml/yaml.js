
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Yaml/JSON conversion.
 * @namespace yaml
 * @example
 * const { yaml } = require('dev-env-lib');
 */
class Yaml {

  /**
   * Load a yaml file into JavaScript object.
   * @memberOf yaml
   * @function load
   * @param {cp~PathSegments} ymlPath
   * @returns {Object} yaml file properties
   */
  load(ymlPath) {
    if (!ymlPath) throw new Error('Missing required argument: ymlPath');
    if (ymlPath instanceof Array) {
      ymlPath = ymlPath.reduce((agg, value) => path.resolve(agg, value));
    }
    return yaml.safeLoad(fs.readFileSync(ymlPath, 'utf8'));
  }

  /**
   * Convert JSON object to Yaml string.
   * @memberOf yaml
   * @function dump
   * @param {Object} config
   * @returns {string} yaml string value
   */
  dump(config) {
    return yaml.dump(config);
  }

}

module.exports = new Yaml();
module.exports.Yaml = Yaml;

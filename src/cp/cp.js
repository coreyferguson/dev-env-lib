
const path = require('path');
const { spawn } = require('child_process');
const templateParser = require('child-process-template-parser');

/**
 * Node's child_process wrapped in a promise with buffered stdio.
 * @namespace cp
 * @example
 * const { cp } = require('dev-env-lib');
 */
class ChildProcess {

  /**
   * Aggregated output from a child process.
   * @typedef {Object} cp~AggregatedOutput
   * @property {string} output Aggregated stdout and stderr
   * @property {string} stdout Aggregated stdout
   * @property {string} stderr Aggregated stderr
   */

  /**
   * A single path or a sequence of path segments.
   * @typedef {string|string[]} cp~PathSegments
   * @example
   * const singlePath = __dirname;
   * const pathSegments = [__dirname, 'relative/path']
   */

  /**
   * Spawn a new process. Wrap in a promise. Buffer output.
   * @memberOf cp
   * @function spawn
   * @param {cp~PathSegments} options.cwd
   * @param {string} options.command Same as Node's child_process.spawn
   * @param {string[]} [options.args] Same as Node's child_process.spawn
   * @param {Object} [options.nodeSpawnOptions] Node's child_process.spawn options
   * @returns {Promise.<cp~AggregatedOutput>} aggregated output
   * @see [Node's child_process.spawn]{@link https://nodejs.org/dist/latest-v6.x/docs/api/child_process.html#child_process_child_process_spawn_command_args_options}
   */
  spawn(options) {
    options = options || {};
    const args = options.args || [];
    const command = options.command;
    if (!command) return Promise.reject(
      new Error('Missing required option: command'));
    let nodeSpawnOptions = options.nodeSpawnOptions;
    let cwd = options.cwd;
    if (!cwd) return Promise.reject(new Error('Missing required option: cwd'));
    if (cwd instanceof Array) {
      cwd = cwd.reduce((agg, value) => path.resolve(agg, value));
    }
    nodeSpawnOptions = Object.assign({ cwd }, nodeSpawnOptions);
    return new Promise((resolve, reject) => {
      let cp;
      if (args === undefined) cp = spawn(command, nodeSpawnOptions);
      else cp = spawn(command, args, nodeSpawnOptions);
      let output = '';
      let stdout = '';
      let stderr = '';
      cp.stdout.on('data', data => {
        output += data;
        stdout += data;
      });
      cp.stderr.on('data', data => {
        output += data;
        stderr += data;
      });
      cp.on('close', code => {
        const response = { code, output, stdout, stderr };
        if (code === 0) resolve(response);
        else reject(response);
      });
    });
  }


  /**
   * Spawn a new process using the given template for the command and args.
   * @memberOf cp
   * @function spawnTemplate
   * @param {cp~PathSegments} options.cwd
   * @param {cp~PathSegments} options.templatePath path to template.
   * @param {Object} [options.model] Model object passed into template.
   * @param {Object} [options.nodeSpawnOptions] Node's child_process.spawn options
   * @returns {Promise.<cp~AggregatedOutput>} aggregated output
   * @see [Node's child_process.spawn]{@link https://nodejs.org/dist/latest-v6.x/docs/api/child_process.html#child_process_child_process_spawn_command_args_options}
   */
  spawnTemplate(options) {
    options = options || {};
    let templatePath = options.templatePath;
    if (templatePath instanceof Array) {
      templatePath = templatePath.reduce((agg, value) => {
        return path.resolve(agg, value);
      });
    }
    const model = options.model;
    const nodeSpawnOptions = options.nodeSpawnOptions;
    let cwd = options.cwd;
    if (!cwd) return Promise.reject(
      new Error('Missing required option: cwd'));
    if (cwd instanceof Array) {
      cwd = cwd.reduce((agg, value) => {
        return path.resolve(agg, value);
      });
    }
    const { command, args } = templateParser.parse(templatePath, model);
    return this.spawn({ cwd, command, args, nodeSpawnOptions });
  }

}

module.exports = new ChildProcess();
module.exports.ChildProcess = ChildProcess;

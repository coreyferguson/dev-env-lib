
const path = require('path');
const { spawn } = require('child_process');
const templateParser = require('child-process-template-parser');

/**
 * @memberOf dev
 * @namespace cp
 */

class ChildProcess {

  constructor(options) {
    options = options || {};
    this._path = options.path || path;
    this._spawn = options.spawn || spawn;
    this._templateParser = options.templateParser || templateParser;
    this._workingDirectory = options.workingDirectory;
  }

  /**
   * Aggregated output from a child process.
   * @typedef {Object} dev.cp~AggregatedOutput
   * @property {string} output Aggregated stdout and stderr
   * @property {string} stdout Aggregated stdout
   * @property {string} stderr Aggregated stderr
   */

  /**
   * Spawn a new process. Wrap in a promise. Buffer output.
   * @memberOf dev.cp
   * @function spawn
   * @param {string} command Same as Node's child_process.spawn
   * @param {string[]} args Same as Node's child_process.spawn
   * @param {Object} options Same as Node's child_process.spawn
   * @returns {dev.cp~AggregatedOutput} aggregated output
   * @see [Node's child_process.spawn]{@link https://nodejs.org/dist/latest-v6.x/docs/api/child_process.html#child_process_child_process_spawn_command_args_options}
   */
  spawn(command, args, options) {
    options = Object.assign({
      cwd: this._workingDirectory
    }, options);
    return new Promise((resolve, reject) => {
      let cp;
      if (args === undefined) cp = this._spawn(command, options);
      else cp = this._spawn(command, args, options);
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
   * @memberOf dev.cp
   * @function spawnTemplate
   * @param {string} templatePath Relative or absolute path to template.
   * @param {Object} model Model object passed into template.
   * @param {Object} options Same as Node's child_process.spawn
   * @returns {dev.cp~AggregatedOutput} aggregated output
   * @see [Node's child_process.spawn]{@link https://nodejs.org/dist/latest-v6.x/docs/api/child_process.html#child_process_child_process_spawn_command_args_options}
   */
  spawnTemplate(templatePath, model, options) {
    const absolutePath = this._path.resolve(this._workingDirectory, templatePath);
    const cmd = templateParser.parse(absolutePath, model);
    return this.spawn(cmd.command, cmd.args, options);
  }

}

module.exports = ChildProcess;

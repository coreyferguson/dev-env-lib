
const path = require('path');
const { spawn } = require('child_process');
const templateParser = require('child-process-template-parser');

/**
 * Node's child_process wrapped in a promise with buffered stdio.
 */
class ChildProcess {

  /**
   * @param {string} workingDirectory - Default working directory when spawning processes.
   * @param {string} sourceDirectory - Source directory used when resolving spawn templates.
   */
  constructor(options) {
    options = options || {};
    const { workingDirectory, sourceDirectory } = options;
    if (workingDirectory === undefined) {
      throw new Error('Missing required option: workingDirectory');
    }
    this._workingDirectory = options.workingDirectory;
    if (sourceDirectory === undefined) {
      throw new Error('Missing required option: sourceDirectory');
    }
    this._sourceDirectory = options.sourceDirectory;
  }

  /**
   * Aggregated output from a child process.
   * @typedef {Object} ChildProcess~AggregatedOutput
   * @property {string} output Aggregated stdout and stderr
   * @property {string} stdout Aggregated stdout
   * @property {string} stderr Aggregated stderr
   */

  /**
   * Spawn a new process. Wrap in a promise. Buffer output.
   * @param {string} command Same as Node's child_process.spawn
   * @param {string[]} args Same as Node's child_process.spawn
   * @param {Object} options Same as Node's child_process.spawn
   * @returns {ChildProcess~AggregatedOutput} aggregated output
   * @see [Node's child_process.spawn]{@link https://nodejs.org/dist/latest-v6.x/docs/api/child_process.html#child_process_child_process_spawn_command_args_options}
   */
  spawn(command, args, options) {
    options = Object.assign({
      cwd: this._workingDirectory
    }, options);
    return new Promise((resolve, reject) => {
      let cp;
      if (args === undefined) cp = spawn(command, options);
      else cp = spawn(command, args, options);
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
   * @param {string} templatePath Absolute or relative (from sourceDirectory) path to template.
   * @param {Object} model Model object passed into template.
   * @param {Object} options Same as Node's child_process.spawn
   * @returns {ChildProcess~AggregatedOutput} aggregated output
   * @see [Node's child_process.spawn]{@link https://nodejs.org/dist/latest-v6.x/docs/api/child_process.html#child_process_child_process_spawn_command_args_options}
   */
  spawnTemplate(templatePath, model, options) {
    options = Object.assign({
      cwd: this._workingDirectory
    }, options);
    const absolutePath = path.resolve(this._sourceDirectory, templatePath);
    const cmd = templateParser.parse(absolutePath, model);
    return this.spawn(cmd.command, cmd.args, options);
  }

}

module.exports = ChildProcess;

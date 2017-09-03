
const path = require('path');
const { spawn } = require('child_process');
const templateParser = require('child-process-template-parser');

class ChildProcess {

  constructor(options) {
    options = options || {};
    this._path = options.path || path;
    this._spawn = options.spawn || spawn;
    this._templateParser = options.templateParser || templateParser;
    this._workingDirectory = options.workingDirectory;
  }

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

  spawnTemplate(templatePath, model, options) {
    const absolutePath = this._path.resolve(this._workingDirectory, templatePath);
    const cmd = templateParser.parse(absolutePath, model);
    return this.spawn(cmd.command, cmd.args, options);
  }

}

module.exports = ChildProcess;

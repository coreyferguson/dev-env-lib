
const ChildProcess = require('./cp');
const Config = require('./config');
const Docker = require('./docker');
const fs = require('fs');
const path = require('path');
const Yaml = require('./yaml');

class DevCli {

  constructor(options) {
    // optional options
    options = options || {};
    this._fs = options.fs || fs;
    this._path = options.path || path;
    // required options
    const { defaultConfigPath, userConfigName, workingDirectory } = options;
    if (!workingDirectory) throw new Error('missing reguired option: workingDirectory');
    else this._fs.accessSync(workingDirectory, this._fs.W_OK);
    // instantiate api
    this.config = new Config({
      workingDirectory,
      defaultConfigPath,
      userConfigName
    });
    this.cp = new ChildProcess({ workingDirectory });
    this.docker = new Docker({ workingDirectory });
    this.yaml = new Yaml({ workingDirectory });
  }

}

module.exports = DevCli;

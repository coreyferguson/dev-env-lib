
const ChildProcess = require('./cp');
const Config = require('./config');
const Docker = require('./docker');
const fs = require('fs');
const Git = require('./git');
const Yaml = require('./yaml');
const Path = require('./path');

/**
 * @namespace dev
 */

class DevCli {

  constructor(options) {
    // optional options
    options = options || {};
    this._fs = options.fs || fs;
    // required options
    const { defaultConfigPath, userConfigPath, workingDirectory } = options;
    if (!workingDirectory) throw new Error('missing reguired option: workingDirectory');
    else this._fs.accessSync(workingDirectory, this._fs.W_OK);
    // instantiate api
    this.config = new Config({
      workingDirectory,
      defaultConfigPath,
      userConfigPath
    });

    this.cp = new ChildProcess({ workingDirectory });
    this.docker = new Docker({ workingDirectory });
    this.git = new Git({ workingDirectory });
    this.yaml = new Yaml({ workingDirectory });
    this.path = new Path({ workingDirectory });
  }

}

module.exports = DevCli;

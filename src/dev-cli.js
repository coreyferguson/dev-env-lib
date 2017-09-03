
const ChildProcess = require('./cp');
const Docker = require('./docker');
const fs = require('fs');

class DevCli {

  constructor(options) {
    // validate options
    options = options || {};
    const { workingDirectory } = options;
    if (!workingDirectory) throw new Error('missing reguired option: workingDirectory ')
    else fs.accessSync(workingDirectory, fs.R_OK);

    // instantiate api
    this.cp = new ChildProcess({ workingDirectory });
    this.docker = new Docker({ workingDirectory });
  }

}

module.exports = DevCli;

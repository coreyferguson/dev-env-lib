
const fs = require('fs');

class DevCli {

  constructor(options) {
    this.validate(options);
  }

  validate(options) {
    options = options || {};
    const { projectDirectory } = options;
    if (!projectDirectory) throw new Error('missing reguired option: projectDirectory ')
    else fs.accessSync(projectDirectory, fs.R_OK);
  }

}

module.exports = DevCli;

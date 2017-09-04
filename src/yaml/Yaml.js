
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class Yaml {

  constructor(options) {
    options = options || {};
    this._workingDirectory = options.workingDirectory;
    this._fs = options.fs || fs;
    this._path = options.path || path;
    this._yaml = options.yaml || yaml;
  }

  load(ymlPath) {
    const absolutePath = this._path.resolve(this._workingDirectory, ymlPath);
    return this._yaml.safeLoad(this._fs.readFileSync(absolutePath, 'utf8'));
  }

}

module.exports = Yaml;

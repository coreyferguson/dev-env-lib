
const fs = require('fs');
const nconf = require('nconf');
const os = require('os');
const path = require('path');
const yaml = require('js-yaml');

class Config {

  constructor(options) {
    options = options || {};
    // optional
    this._fs = options.fs || fs;
    this._nconf = options.nconf || nconf;
    this._os = options.os || os;
    this._path = options.path || path;
    this._yaml = options.yaml || yaml;
    // optional - defaultConfigPath
    if (options.defaultConfigPath !== undefined) {
      this._defaultConfigPath = options.defaultConfigPath;
      const absPath = this._path.resolve(
        options.workingDirectory, options.defaultConfigPath);
      this._fs.accessSync(absPath, this._fs.W_OK);
    }
    // optional - userConfigPath
    if (options.userConfigPath !== undefined) {
      this._userConfigPath = options.userConfigPath;
      const absPath = this._path.resolve(
        this._os.homedir(), options.userConfigPath);
      this._fs.accessSync(absPath, this._fs.W_OK);
    }
    // required - workingDirectory
    if (options.workingDirectory === undefined) {
      throw new Error('Missing required option: workingDirectory');
    }
    this._workingDirectory = options.workingDirectory;
    this.reset();
  }

  setup() {
    this._nconf.argv();
    this._nconf.env();
    this._nconf.file('/nconf/doesnt/work/without/this');
    this._loadUserConfig();
    this._loadDefaultConfig();
  }

  reset() {
    this._nconf.overrides({});
    this._nconf.defaults({});
    this._nconf.reset();
  }

  get(key) {
    return nconf.get(key);
  }

  set(key, value) {
    nconf.set(key, value);
    return this;
  }

  _loadUserConfig(options) {
    if (this._userConfigPath) {
      options = Object.assign({}, options, {
        silent: true
      });
      try {
        const absPath = this._path.resolve(this._os.homedir(), this._userConfigPath);
        const config = yaml.safeLoad(fs.readFileSync(absPath, 'utf8'));
        this._nconf.overrides(config);
      } catch (err) {
        if (!options.silent) throw err;
        else if (options.silent && err.code !== 'ENOENT') throw err;
      }
    }
  }

  _loadDefaultConfig() {
    if (this._defaultConfigPath) {
      const absolutePath = this._path.resolve(
        this._workingDirectory, this._defaultConfigPath);
      const config = this._yaml.safeLoad(
        this._fs.readFileSync(absolutePath, 'utf8'));
      this._nconf.defaults(config);
    }
  }

}

module.exports = Config;

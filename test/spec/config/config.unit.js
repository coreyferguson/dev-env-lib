
const Config = require('../../../src/config');
const nconf = require('nconf');
const path = require('path');
const { expect } = require('../../util/test');

describe('config unit tests', () => {

  const minOptions = { workingDirectory: __dirname };
  const defaultConfigPath = 'default-config.yml';
  const userConfigPath = path.resolve(__dirname, 'user-config.yml');

  afterEach(() => {
    nconf.defaults({});
    nconf.overrides({});
    nconf.reset();
  });

  it('constructor - minimum required options', () => {
    const config = new Config(minOptions);
  });

  it('constructor - defaults file does not exist', () => {
    expect(() => {
      const config = new Config(Object.assign({}, minOptions, {
        defaultConfigPath: 'no-such-config.yml'
      }));
    }).to.throw(/ENOENT/);
  });

  it('constructor - user overrides file does not exist', () => {
    expect(() => {
      const config = new Config(Object.assign({}, minOptions, {
        userConfigPath: 'no-such-config.yml'
      }));
    }).to.throw(/ENOENT/);
  });

  it('setup - default config and user override', () => {
    const config = new Config(Object.assign({}, minOptions, {
      defaultConfigPath,
      userConfigPath
    }));
    config.setup();
    expect(nconf.get('key1')).to.eql('value1');
    expect(nconf.get('key2')).to.eql('user override');
  });

  it('setup - no user config', () => {
    nconf.clear();
    nconf.reset();
    const config = new Config(Object.assign({}, minOptions, {
      defaultConfigPath
    }));
    config.setup();
    expect(nconf.get('key1')).to.eql('value1');
    expect(nconf.get('key2')).to.eql('value2');
  });

  it('setup - no default config', () => {
    const config = new Config(Object.assign({}, minOptions, {
      userConfigPath
    }));
    config.setup();
    expect(nconf.get('key1')).to.be.undefined;
    expect(nconf.get('key2')).to.eql('user override');
  });

});

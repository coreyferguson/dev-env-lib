
const DevCli = require('../../../src/dev-cli');
const { expect } = require('../../util/test');
const path = require('path');

describe.only('dev-cli integration tests', () => {

  let dev;

  before(() => {
    dev = new DevCli({
      workingDirectory: path.resolve(__dirname, 'workingDirectory'),
      userConfigPath: path.resolve(__dirname, 'user-config.yml'),
      defaultConfigPath: 'default-config.yml'
    });
    dev.config.setup();
  });

  it('child process within workingDirectory', () => {
    return dev.cp.spawn('ls').then(response => {
      expect(response.stdout).to.match(/default-config.yml/);
    });
  });

  it('config defaults and user overrides', () => {
    expect(dev.config.get('key1')).to.eql('value1');
    expect(dev.config.get('key2')).to.eql('user override');
  });

  it('docker checks image existance', () => {
    return expect(dev.docker.imageExists('dev-cli-test-docker'))
      .to.eventually.eql(false);
  });

  it('yaml loads config file', () => {
    return expect(dev.yaml.load('default-config.yml')).to.eql({
      key1: 'value1',
      key2: 'value2'
    });
  });

});


const DevCli = require('../../../src/dev-cli');
const { expect } = require('../../util/test');
const path = require('path');

const workingDirectory = path.resolve(__dirname, 'workingDirectory');
const userConfigPath = path.resolve(__dirname, 'user-config.yml');
const defaultConfigPath = 'default-config.yml';

describe('dev-cli e2e tests', () => {

  let dev;

  before(() => {
    dev = new DevCli({ workingDirectory, userConfigPath, defaultConfigPath });
    dev.config.setup();
  });

  afterEach(() => {
    return dev.cp.spawn('rm', ['-fr', 'dev-cli-test']);
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

  it('git clones a repo', () => {
    return dev.git.clone(
      'dev-cli-test',
      'git@github.com:coreyferguson/dev-cli.git',
      'master'
    ).then(() => {
      return dev.cp.spawn('ls', {
        cwd: path.resolve(workingDirectory, 'dev-cli-test')
      });
    }).then(response => {
      expect(response.stdout).to.match(/README\.md/)
    });
  });

});

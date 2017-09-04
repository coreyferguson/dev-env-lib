
const DevCli = require('../../../src');
const { expect } = require('../../util/test');
const path = require('path');

describe('dev-cli unit tests', () => {

  const requiredOptions = {
    workingDirectory: __dirname,
    defaultConfigPath: 'default-config.yml',
    userConfigPath: path.resolve(__dirname, 'user-config.yml')
  };

  it('workingDirectory is required option', () => {
    const options = Object.assign({}, requiredOptions);
    delete options.workingDirectory;
    expect(() => {
      new DevCli(options);
    }).to.throw(/workingDirectory/);
  });

  it('workingDirectory exists', () => {
    const options = Object.assign({}, requiredOptions);
    new DevCli(options);
  });

  it('workingDirectory does not exist', () => {
    const options = Object.assign({}, requiredOptions);
    options.workingDirectory = '/no/such/directory/will/be/found/here/../probably';
    expect(() => {
      new DevCli(options);
    }).to.throw(/ENOENT/);
  });

});
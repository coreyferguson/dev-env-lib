
const DevCli = require('../../../src');
const { expect, yaml } = require('../../util/test');

describe('dev-cli unit tests', () => {

  it('project directory is required option', () => {
    const options = yaml(__dirname, 'config/constructor-required-options.yml');
    delete options.workingDirectory;
    expect(() => {
      new DevCli(options);
    }).to.throw(/workingDirectory/);
  });

  it('project directory exists', () => {
    const options = yaml(__dirname, 'config/constructor-required-options.yml');
    options.workingDirectory = __dirname;
    new DevCli(options);
  });

  it('project directory does not exist', () => {
    const options = yaml(__dirname, 'config/constructor-required-options.yml');
    options.workingDirectory = '/no/such/directory/will/be/found/here/../probably';
    expect(() => {
      new DevCli(options);
    }).to.throw(/ENOENT/);
  });

});

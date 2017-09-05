
const DevEnvLib = require('../../../src');
const { expect } = require('../../util/test');
const path = require('path');

describe('dev-env-lib unit tests', () => {

  const requiredOptions = { workingDirectory: __dirname };

  it('workingDirectory is required option', () => {
    const options = Object.assign({}, requiredOptions);
    delete options.workingDirectory;
    expect(() => {
      new DevEnvLib(options);
    }).to.throw(/workingDirectory/);
  });

  it('workingDirectory exists', () => {
    const options = Object.assign({}, requiredOptions);
    new DevEnvLib(options);
  });

  it('workingDirectory does not exist', () => {
    const options = Object.assign({}, requiredOptions);
    options.workingDirectory = '/no/such/directory/will/be/found/here/../probably';
    expect(() => {
      new DevEnvLib(options);
    }).to.throw(/ENOENT/);
  });

});

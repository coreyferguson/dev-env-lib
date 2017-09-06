
const { expect } = require('../../util/test');
const Yaml = require('../../../src/Yaml');

describe('Yaml unit tests', () => {

  let yaml;

  before(() => {
    yaml = new Yaml({ sourceDirectory: __dirname });
  });

  it('Yaml constructor missing sourceDirectory', () => {
    expect(() => new Yaml()).to.throw(/sourceDirectory/);
  });

  it('load yaml properties', () => {
    const config = yaml.load('example-config.yml');
    expect(config).to.eql({
      key1: 'value1',
      key2: 'value2'
    });
  });

  it('load non-existing yaml properties', () => {
    expect(() => {
      yaml.load('no-such-config.yml');
    }).to.throw(/ENOENT/);
  });

});


const { expect } = require('../../util/test');
const Yaml = require('../../../src/yaml/Yaml');

describe('yaml unit tests', () => {

  let yaml;

  before(() => {
    yaml = new Yaml({ workingDirectory: __dirname });
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

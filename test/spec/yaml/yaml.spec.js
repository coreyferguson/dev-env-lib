
const { expect } = require('../../util/test');
const path = require('path');
const yaml = require('../../../src/yaml');

describe('yaml unit tests', () => {

  it('load yaml properties from absolute path', () => {
    const absolutePath = path.resolve(__dirname, 'example-config.yml');
    const config = yaml.load(absolutePath);
    expect(config).to.eql({
      key1: 'value1',
      key2: 'value2'
    });
  });

  it('load yaml properties from path segments', () => {
    const config = yaml.load([__dirname, 'example-config.yml']);
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

  it('convert json config to yml', () => {
    const yml = yaml.dump({
      key1: 'value1',
      key2: 'value2'
    });
    expect(yml).to.eql('key1: value1\nkey2: value2\n');
  });

});

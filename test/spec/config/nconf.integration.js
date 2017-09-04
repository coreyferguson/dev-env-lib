
const nconf = require('nconf');
const path = require('path');
const { expect } = require('../../util/test');

describe('nconf integration tests', () => {

  const defaultConfigPath = 'default-config.yml';
  const userConfigPath = path.resolve(__dirname, 'user-config.yml');

  it('nconf reset defaults, overrides', () => {
    const defaultConf = path.resolve(__dirname, defaultConfigPath);
    const userConf = userConfigPath;
    nconf.overrides({});
    nconf.defaults({});
    expect(nconf.get('key1')).to.be.undefined;
    expect(nconf.get('key2')).to.be.undefined;
    nconf.env().argv();
    nconf.file('/path/to/config.json');
    nconf.defaults({
      key1: 'value1',
      key2: 'value2'
    });
    expect(nconf.get('key1')).to.be.eql('value1');
    expect(nconf.get('key2')).to.be.eql('value2');
    nconf.overrides({
      key2: 'user override'
    });
    expect(nconf.get('key1')).to.be.eql('value1');
    expect(nconf.get('key2')).to.be.eql('user override');
    nconf.overrides({});
    expect(nconf.get('key1')).to.be.eql('value1');
    expect(nconf.get('key2')).to.be.eql('value2');
  });

});

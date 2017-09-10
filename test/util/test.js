
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const yaml = require('js-yaml');

chai.use(chaiAsPromised);
chai.use(sinonChai);

const getYaml = (thisPath, relativePath) => {
  const filePath = path.resolve(thisPath, relativePath);
  return yaml.load(fs.readFileSync(filePath, 'utf8'));
};

module.exports = {
  expect: chai.expect,
  sinon,
  yaml: getYaml
};

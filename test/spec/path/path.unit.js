
const ChildProcess = require('../../../src/cp/ChildProcess');
const Path = require('../../../src/path');
const { expect } = require('../../util/test');
const nodePath = require('path');

const workingDirectory = __dirname;
const cp = new ChildProcess({ workingDirectory });
const myPath = new Path({ workingDirectory });

describe('myPath unit tests', () => {

  it('resolve relative to working directory by default', () => {
    const expected = nodePath.resolve(__dirname, '..');
    const actual = myPath.resolve('..');
    expect(actual).to.be.equal(expected);
  });

  it('resolve multiple args', () => {
    const expected = nodePath.resolve(__dirname, '../..');
    const actual = myPath.resolve('..', '..');
    expect(actual).to.be.equal(expected);
  });

  it('resolve override with absolute myPath', () => {
    const expected = nodePath.resolve(__dirname, '..');
    const actual = myPath.resolve(expected);
    expect(actual).to.eql(expected);
  });

});

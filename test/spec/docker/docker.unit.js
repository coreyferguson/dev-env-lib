
const Docker = require('../../../src/docker');
const { expect } = require('../../util/test');

describe('docker unit tests', () => {

  const dockerName = 'dev-cli-test-docker';
  let docker;

  before(() => {
    docker = new Docker({
      workingDirectory: __dirname
    });
  });

  afterEach(() => {
    return docker.removeImage(dockerName);
  });

  it('build docker image / check existance', () => {
    return docker.imageExists(dockerName).then(exists => {
      expect(exists).to.be.false;
      return docker.buildImage('dockerFilePath', dockerName);
    }).then(() => {
      return docker.imageExists(dockerName);
    }).then(exists => {
      expect(exists).to.be.true;
    });
  });

  it('remove docker image', () => {
    return docker.buildImage('dockerFilePath', dockerName).then(() => {
      return docker.imageExists(dockerName);
    }).then(exists => {
      expect(exists).to.be.true;
      return docker.removeImage(dockerName);
    }).then(response => {
      expect(response.stdout).to.match(new RegExp(`Untagged: ${dockerName}`));
      return docker.imageExists(dockerName);
    }).then(exists => {
      expect(exists).to.be.false;
    });
  });

  it('remove docker image twice - no error', () => {
    return docker.removeImage(dockerName).then(() => {
      return docker.removeImage(dockerName);
    });
  });

});

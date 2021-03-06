
const cp = require('../../../src/cp');
const docker = require('../../../src/docker');
const { expect } = require('../../util/test');

describe('docker unit tests', () => {

  const dockerName = 'dev-env-lib-test-docker';
  const networkName = 'dev-env-lib-test-net';
  const containerName = 'dev-env-lib-test-container';

  afterEach(() => {
    return Promise.all([
      docker.removeImage(dockerName),
      docker.removeNetwork(networkName),
      docker.removeContainer(containerName)
    ]);
  });

  it('build docker image / check existance', () => {
    return docker.imageExists(dockerName).then(exists => {
      expect(exists).to.be.false;
      return docker.buildImage(dockerName, [__dirname, 'dockerFilePath']);
    }).then(() => {
      return docker.imageExists(dockerName);
    }).then(exists => {
      expect(exists).to.be.true;
    });
  });

  it('remove docker image', () => {
    return docker.buildImage(dockerName, [__dirname, 'dockerFilePath']).then(() => {
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

  it('create network', () => {
    return docker.createNetwork(networkName).then(response => {
      expect(response.stdout).to.match(/\w+\n/);
    });
  });

  it('network already exists', () => {
    return docker.createNetwork(networkName).then(() => {
      return docker.createNetwork(networkName);
    });
  });

  it('remove existing container', () => {
    return cp.spawn({
      cwd: __dirname,
      command: 'docker',
      args: [
        'run',
        '--rm',
        '-d',
        `--name=${containerName}`,
        'alpine',
        'sh',
        '-c',
        'tail -f /.dockerenv'
      ]
    }).then(() => {
      return docker.removeContainer(containerName);
    });
  });

  it('remove non-existant container', () => {
    return docker.removeContainer(containerName);
  });

  it('wait for container output', () => {
    return cp.spawn({
      cwd: __dirname,
      command: 'docker',
      args: [
        'run',
        '-d',
        '--rm',
        `--name=${containerName}`,
        'alpine',
        'echo',
        'hello world'
      ]
    }).then(() => {
      return docker.waitForContainerOutput(containerName, /hello world/);
    });
  });

  it('wait for container output that never occurs', () => {
    return cp.spawn({
      cwd: __dirname,
      command: 'docker',
      args: [
        'run',
        '-d',
        '--rm',
        `--name=${containerName}`,
        'alpine',
        'echo',
        'hello world'
      ]
    }).then(() => {
      return expect(
        docker.waitForContainerOutput(containerName, /some other message/)
      ).to.eventually.be.rejectedWith(/stdio closed without matching regex/);
    });
  });

});

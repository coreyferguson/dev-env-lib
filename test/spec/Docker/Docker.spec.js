
const Docker = require('../../../src/Docker');
const { expect } = require('../../util/test');
const ChildProcess = require('../../../src/ChildProcess');

describe('Docker unit tests', () => {

  const dockerName = 'dev-env-lib-test-docker';
  const networkName = 'dev-env-lib-test-net';
  const containerName = 'dev-env-lib-test-container';
  const workingDirectory = __dirname;
  const sourceDirectory = workingDirectory;
  const defaultOptions = { workingDirectory };
  const docker =  new Docker(defaultOptions);
  const cp = new ChildProcess({ workingDirectory, sourceDirectory });

  afterEach(() => {
    return Promise.all([
      docker.removeImage(dockerName),
      docker.removeNetwork(networkName),
      docker.removeContainer(containerName)
    ]);
  });

  it('Docker constructor missing workingDirectory', () => {
    const options = Object.assign({}, defaultOptions);
    delete options.workingDirectory;
    expect(() => new Docker(options)).to.throw(/workingDirectory/);
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
    return cp.spawn(
      'docker',
      [
        'run',
        '--rm',
        '-d',
        `--name=${containerName}`,
        'alpine',
        'sh',
        '-c',
        'tail -f /.dockerenv'
      ]
    ).then(() => {
      return docker.removeContainer(containerName);
    });
  });

  it('remove non-existant container', () => {
    return docker.removeContainer(containerName);
  });

  it('wait for container output', () => {
    return cp.spawn(
      'docker',
      [
        'run',
        '-d',
        '--rm',
        `--name=${containerName}`,
        'alpine',
        'echo',
        'hello world'
      ]
    ).then(() => {
      return docker.waitForContainerOutput(containerName, /hello world/);
    });
  });

  it('wait for container output that never occurs', () => {
    return cp.spawn(
      'docker',
      [
        'run',
        '-d',
        '--rm',
        `--name=${containerName}`,
        'alpine',
        'echo',
        'hello world'
      ]
    ).then(() => {
      return expect(
        docker.waitForContainerOutput(containerName, /some other message/)
      ).to.eventually.be.rejectedWith(/stdio closed without matching regex/);
    });
  });

});

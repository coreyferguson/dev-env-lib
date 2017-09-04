
const path = require('path');

/**
 * @memberOf dev
 * @namespace path
 */

class Path {

  constructor(options) {
    options = options || {};
    this._workingDirectory = options.workingDirectory;
    if (options.workingDirectory === undefined) {
      throw new Error('Missing required option: workingDirectory');
    }
    this._path = options.path || path;
  }

  /**
   * Resolve the given arguments into an absolute path.
   * Similar to Node.js path.resolve
   * @memberOf dev.path
   * @function resolve
   * @see [Node's path.resolve]{@link https://nodejs.org/api/path.html#path_path_resolve_paths}
   */
  resolve(/**/) {
    const argsPlusCwd = [];
    argsPlusCwd.push(this._workingDirectory);
    for (let i=0; i<arguments.length; i++) {
      argsPlusCwd.push(arguments[i]);
    }
    return path.resolve.apply(null, argsPlusCwd);
  }

}

module.exports = Path;

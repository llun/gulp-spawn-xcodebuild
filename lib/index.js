var through2 = require('through2')
  , proc = require('child_process')
  , path = require('path')
  , _ = require('lodash')

var xcodebuild = function (action, options) {
  return through2.obj(function (chunk, enc, callback) {
    var root = chunk.path ? chunk.path : chunk

    options = options || {}
    var parameters = []

    switch (action) {
    case 'showsdks':
      parameters.push('-showsdks')
      break;
    case 'clean':
      parameters.push(action)
      break;
    }

    var availableOptions = [ 'scheme', 'configuration' ]
    _.each(availableOptions, function (available) {
      if (options[available]) {
        parameters = parameters.concat(['-' + available, options[available]])
      }
    })

    var buildDir = path.join(root, options.buildDir || 'build')
    parameters.push('BUILD_DIR=' + buildDir)

    var child = proc.spawn('xcodebuild', parameters, {
      cwd: root
    })

    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
    child.stdin.pipe(process.stdin)
    callback()
  })
}

module.exports = xcodebuild

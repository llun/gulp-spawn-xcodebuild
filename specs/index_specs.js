describe('gulp-spawn-xcodebuild', function () {

  var chai = require('chai')
    , sinon = require('sinon')
    , expect = chai.expect
    , proc = require('child_process')
    , through2 = require('through2')
    , xcodebuild = require('../lib')

  chai.use(require('sinon-chai'))

  beforeEach(function () {
    sinon.stub(proc, 'spawn')
    proc.spawn.returns({
      stdin: sinon.stub(through2()),
      stdout: sinon.stub(through2()),
      stderr: sinon.stub(through2()),
      on: sinon.stub(),
      once: sinon.stub()
    })

  })

  afterEach(function () {
    proc.spawn.restore()
  })

  it ('should spawn xcodebuild for each path', function () {
    var paths = [ 'path1', 'path2' ]
      , stream = xcodebuild()

    paths.forEach(function (path) {
      stream.write({ path: path })
      expect(proc.spawn).to.have.been.calledWith('xcodebuild',
        [ 'BUILD_DIR=' + path + '/build' ],
        {
          cwd: path
        })
    })

  })

  it ('should pass string as path', function () {
    var stream = xcodebuild()
    stream.write('path')

    expect(proc.spawn).to.have.been.calledWith('xcodebuild',
      [ 'BUILD_DIR=path/build' ],
      {
        cwd: 'path'
      })
  })

  it ('should put clean action in spawn argument', function () {
    var stream = xcodebuild('clean')
    stream.write('path')

    expect(proc.spawn).to.have.been.calledWith('xcodebuild',
      [ 'clean', 'BUILD_DIR=path/build' ])
  })

  it ('should put -showsdks when action is showsdks', function () {
    var stream = xcodebuild('showsdks')
    stream.write('path')

    expect(proc.spawn).to.have.been.calledWith('xcodebuild',
      [ '-showsdks', 'BUILD_DIR=path/build' ])
  })

  it ('should add options to xcodebuild arguments', function () {
    var stream = xcodebuild(null, {
      configuration: 'Release',
      scheme: 'Project'
    })
    stream.write('path')

    expect(proc.spawn).to.have.been.calledWith('xcodebuild',
      [ '-scheme', 'Project', '-configuration', 'Release',
        'BUILD_DIR=path/build' ])

  })

  it ('should change build dir to new path', function () {
    var stream = xcodebuild(null, {
      buildDir: 'release'
    })
    stream.write('path')

    expect(proc.spawn).to.have.been.calledWith('xcodebuild',
      [ 'BUILD_DIR=path/release' ])
  })

  it ('should pass path to another pipe', function (done) {
    var stream = xcodebuild()

    stream.pipe(through2.obj(function (chunk, enc, callback) {
      expect(chunk).to.equal('path')

      callback()
      done()
    }))

    stream.write('path')
  })

})

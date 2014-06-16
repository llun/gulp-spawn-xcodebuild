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

    var mock = sinon.stub(through2())
    mock.stdin = mock.stdout = mock.stderr = sinon.stub(through2())
    proc.spawn.returns(mock)

  })

  afterEach(function () {
    proc.spawn.restore()
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

})

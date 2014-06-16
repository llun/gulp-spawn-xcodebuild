# gulp-spawn-xcodebuild

This plugin spawns xcodebuild as child process for building Xcode project from
command line.

## Usage

Pipe src to plugin with action and options `xcodebuild(action, options)`

### Sample

```javascript
var gulp = require('gulp')
  , xcodebuild = require('gulp-spawn-xcodebuild')

gulp.task('build', function () {
  return gulp.src('xcode_project_folder')
    .pipe(xcodebuild('build', {
      buildDir: 'build'
    }))
})
```

### Available Actions

 - `build`, build Xcode project
 - `clean`, clean Xcode project
 - `showsdks`, list all supported sdks

### Available Options

 - `buildDir`, target build directory. Default is `build` in `src`
 - `sdk`, Target SDK for this project
 - `target`, Build target

## License

MIT

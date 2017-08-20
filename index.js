const File = require('vinyl')
const findAllDependencies = require('find-elm-dependencies').findAllDependencies
const fs = require('fs')
const path = require('path')
const through = require('through2')

const PLUGIN = 'gulp-elm-find-dependencies'

module.exports = function() {
  const transform = function(file, encode, callback) {
    if (file.isNull()) {
      return callback()
    }

    if (file.isStream()) {
      this.emit(
        'error',
        new Error('gulp-elm-find-dependencies: Streaming not supported')
      )
      return callback()
    }

    const _this = this

    _this.push(file)

    findAllDependencies(file.path)
      .then(function(deps) {
        return Promise.all(
          deps.map(function(dep) {
            return new Promise(function(resolve, reject) {
              fs.readFile(dep, function(err, contents) {
                _this.push(
                  new File({
                    cwd: process.cwd(),
                    path: dep,
                    contents,
                  })
                )
                resolve()
              })
            })
          })
        )
      })
      .then(function() {
        callback()
      })
      .catch(function(e) {
        callback()
      })
  }

  return through.obj(transform)
}

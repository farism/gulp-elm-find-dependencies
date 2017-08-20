const { findAllDependencies } = require('find-elm-dependencies')
const File = require('vinyl')
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
        new Error('gulp-elm-find-dependencies: Streaming not supported'),
      )
      return callback()
    }

    this.push(file)

    findAllDependencies(file.path)
      .then(deps => {
        return Promise.all(
          deps.map(dep => {
            return new Promise((resolve, reject) => {
              fs.readFile(dep, (err, contents) => {
                this.push(
                  new File({
                    cwd: process.cwd(),
                    path: dep,
                    contents,
                  }),
                )
                resolve()
              })
            })
          }),
        )
      })
      .then(() => callback())
  }

  return through.obj(transform)
}

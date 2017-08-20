/* global describe, it */

const expect = require('chai').expect
const assert = require('stream-assert')
const File = require('vinyl')
const fs = require('fs')
const path = require('path')

const findElmDependencies = require('../')

const fixture = function(glob) {
  return path.join(__dirname, 'fixture', 'src', glob)
}

describe('gulp-elm-find-dependencies', function() {
  var stream

  beforeEach(function() {
    stream = findElmDependencies()
  })

  it('should work in buffer mode', function(done) {
    stream
      .pipe(assert.nth(0, dep => expect(dep.path).to.eql(fixture('Main.elm'))))
      .pipe(assert.nth(1, dep => expect(dep.path).to.eql(fixture('Dep.elm'))))
      .pipe(assert.nth(2, dep => expect(dep.path).to.eql(fixture('Dep2.elm'))))
      .pipe(assert.end(done))
    stream.write(
      new File({
        path: fixture('Main.elm'),
        contents: fs.readFileSync(fixture('Main.elm')),
      })
    )
    stream.end()
  })

  it('should emit error on streamed file', done => {
    stream
      .once('error', function(err) {
        expect(err.message).to.eql(
          'gulp-elm-find-dependencies: Streaming not supported'
        )
      })
      .pipe(assert.end(done))
    stream.write({
      isNull: function() {
        return false
      },
      isStream: function() {
        return true
      },
    })
    stream.end()
  })

  it('should ignore null files', function(done) {
    stream.pipe(assert.length(0)).pipe(assert.end(done))
    stream.write(new File())
    stream.end()
  })
})

# gulp-elm-find-dependencies [![Circle CI](https://circleci.com/gh/farism/gulp-elm-find-dependencies/tree/master.svg?style=svg)](https://circleci.com/gh/farism/gulp-elm-find-dependencies/tree/master)

Given an `*.elm` file, it will use [`find-elm-dependencies`](https://github.com/NoRedInk/find-elm-dependencies) to aggregate all of the dependencies for that tree. For each file found it will emit a vinyl object.

#### Example

```js
const elmFindDependencies = require('gulp-elm-find-dependencies')

gulp.task('find-deps', () => {
  return gulp.src('Main.elm')
    .pipe(elmFindDependencies())
    .pipe(gulp.dest('dependencies'))
})
```

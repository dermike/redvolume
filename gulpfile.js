var gulp = require('gulp');
var uncss = require('gulp-uncss'),
    concatCss = require('gulp-concat-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css');

gulp.task('default', function() {
  gulp.src(['css/bootstrap.css', 'css/custom.css'])
    .pipe(uncss({
      html: ['index.html', 'about.html', 'allnews.html', 'releases.html'],
      ignore: ['.collapsing', '.collapse.in']
    }))
    .pipe(concatCss("bundle.css"))
    .pipe(minifycss())
    .pipe(gulp.dest('./out'));
});

gulp.task('scripts', function() {
  gulp.src(['js/jquery-2.1.0.js', 'js/bootstrap.js'])
    .pipe(uglify())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./out'))
});
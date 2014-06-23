var gulp = require('gulp');
var uncss = require('gulp-uncss'),
    concatCss = require('gulp-concat-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css');

gulp.task('css', function() {
  gulp.src(['bower_components/bootstrap/dist/css/bootstrap.css', 'css/custom.css'])
    .pipe(uncss({
      html: ['index.html', 'about.html', 'allnews.html', 'releases.html'],
      ignore: ['.collapsing', '.collapse.in'] // Classes added by JS for navbar collapse
    }))
    .pipe(concatCss("bundle.css"))
    .pipe(minifycss())
    .pipe(gulp.dest('./css'));
});

gulp.task('scripts', function() {
  gulp.src(['bower_components/jquery/dist/jquery.js', 'bower_components/bootstrap/dist/js/bootstrap.js'])
    .pipe(uglify())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./js'));
});

gulp.task('default', ['css', 'scripts']);

var gulp = require('gulp');
var uncss = require('gulp-uncss'),
    concatCss = require('gulp-concat-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    s3 = require("gulp-s3"),
    fs = require("fs"),
    aws = JSON.parse(fs.readFileSync('aws.json'));

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
  gulp.src(['bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap/js/transition.js',
            'bower_components/bootstrap/js/collapse.js'])
    .pipe(uglify())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./js'));
});

gulp.task('s3root', function() {
  gulp.src(['index.html', 'about.html', 'allnews.html', 'releases.html', 'rss.xml'])
    .pipe(s3(aws));
});

gulp.task('s3css', function() {
  gulp.src(['css/bundle.css'])
    .pipe(s3(aws, {uploadPath: 'css/'}));
});

gulp.task('s3js', function() {
  gulp.src(['css/all.js'])
    .pipe(s3(aws, {uploadPath: 'js/'}));
});

gulp.task('s3img', function() {
  gulp.src(['img/**'])
    .pipe(s3(aws, {uploadPath: 'img/'}));
});

gulp.task('default', ['css', 'scripts']);

gulp.task('s3', ['s3root', 's3css', 's3js', 's3img'])

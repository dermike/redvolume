var gulp = require('gulp');
var uncss = require('gulp-uncss');
gulp.task('default', function() {
    gulp.src('css/bootstrap.css')
        .pipe(uncss({
            html: ['index.html', 'about.html', 'allnews.html', 'releases.html'],
            ignore: ['.collapsing']
        }))
        .pipe(gulp.dest('./out'));
});

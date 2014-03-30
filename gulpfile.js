var gulp = require('gulp');
var uncss = require('gulp-uncss');
gulp.task('default', function() {
    gulp.src('css/bootstrap.min.css')
        .pipe(uncss({
            html: ['index.html', 'about.html', 'allnews.html', 'releases.html']
        }))
        .pipe(gulp.dest('./out'));
});

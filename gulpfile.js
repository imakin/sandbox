var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var esmify = require('esmify');

gulp.task('build', function () {
    return browserify({
            entries: [
                'src/js/img-drag.js',
            ],
            plugin: [esmify],
            standalone: 'lib',
        })
        .bundle()
        .pipe(source('lib-bundle.js'))
        .pipe(buffer())
        .pipe(gulp.dest('src/js/'));
});
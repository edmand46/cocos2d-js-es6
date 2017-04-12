var uglify = require('gulp-uglify');
var gulp = require('gulp');
var del = require('del');
var webserver = require('gulp-webserver');
var htmlreplace = require('gulp-html-replace');
var jscursh = require('gulp-jscrush');
var concat = require('gulp-concat');
var babel = require('gulp-babel');

gulp.task('compile', ['clean'], () => {
    return gulp.src(['./src/**/**', './main.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('compress', ['compile'], () => {
    return gulp.src(['./framework/cocos2d-js-v3.14.1.js', './dist/*'])
        .pipe(concat('game.build.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', () => {
    return del([
        './dist/**/*'
    ]);
});

gulp.task('clean-trash', ['compress'], () => {
    return del([
        './dist/**/*',
        '!./dist/game.build.js'
    ]);
});

gulp.task('copy-resources', ['update-links'], () => {
    return gulp.src(['./res/**/*','./project.json'], {'base' : '.'} ).pipe(gulp.dest('./dist'));
});

gulp.task('update-links', ['clean-trash'], () => {
    gulp.src('./index.html')
        .pipe(htmlreplace({
            'js': 'game.build.js'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('clean-trash-debug', ['compress-debug'], () => {
    return del([
        './dist/**/*',
        '!./dist/game.build.js'
    ]);
});

gulp.task('compress-debug', ['compile'], () => {
    return gulp.src(['./dist/*'])
        .pipe(concat('game.build.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});
gulp.task('obfuscate', () => {
    return gulp.src('./framework/cocos2d-js-v3.10.js').pipe(jscursh()).pipe(gulp.dest('./build'));
});

gulp.task('build', ['copy-resources']);

gulp.task('default', ['clean-trash-debug'] , () => {
    gulp.src('./')
        .pipe(webserver({
            livereload: {
                enable : true,
                filter: function(fileName) {
                    if (fileName.match('node_moduels') || fileName.match('dist')) { // exclude all source maps from livereload
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            directoryListing: true,
            open: './index.html'
        }));

    gulp.watch(['./src/**/*.js', './main.js'], function(event) {
        gulp.run('clean-trash-debug');
    });
});
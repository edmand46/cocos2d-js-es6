var uglify = require('gulp-uglify');
var gulp = require('gulp');
var del = require('del');
var watch = require('gulp-watch');
var htmlreplace = require('gulp-html-replace');
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
    return gulp.src(['./cocos2d-js-v3.10.js', './dist/*'])
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

gulp.task('build', ['copy-resources']);
gulp.task('default', ['clean-trash-debug'] , () => {
    gulp.watch(['./src/**/*.js', './main.js'], function(event) {
        gulp.run('clean-trash-debug');
    });
});
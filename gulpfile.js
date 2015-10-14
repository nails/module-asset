var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var notify = require('gulp-notify');
var path = require('path');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

//  Styles
gulp.task('css', function() {

    var onError = function(err) {
        notify
            .onError({
                title: 'Error compiling CSS',
                subtitle: 'Check your terminal',
                message: '<%= error.message %>',
                sound: 'Funk',
                contentImage: path.join(__dirname, 'assets/img/nails/icon/icon-red@2x.png'),
                icon: false,
                onLast: true
            })(err);

        this.emit('end');
    };

    gulp.src(['assets/less/*.less'])
        .pipe(plumber({errorHandler: onError}))
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9'],
            cascade: false
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest('./assets/css/'))
        .pipe(notify({
          title: 'Successfully compiled CSS',
          message: '.less files were successfully compiled into CSS',
          sound: false,
          contentImage: path.join(__dirname, 'assets/img/nails/icon/icon@2x.png'),
          icon: false,
          onLast: true
        }));
});

//  JS
gulp.task('js', function() {

    var onError = function(err) {
        notify
            .onError({
                title: 'Error compiling JS',
                message: 'Check your terminal',
                sound: 'Funk',
                contentImage: path.join(__dirname, 'assets/img/nails/icon/icon-red@2x.png'),
                icon: false,
                onLast: true
            })(err);

        this.emit('end');
    };

    gulp.src(['assets/js/*.js', '!assets/js/*.min.js', '!assets/js/*.min.js.map'])
        .pipe(plumber({errorHandler: onError}))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('./', {includeContent: false}))
        .pipe(gulp.dest('./assets/js/'))
        .pipe(notify({
            title: 'Successfully compiled JS',
            message: '.js files were successfully minified and sourcemaps generated',
            contentImage: path.join(__dirname, 'assets/img/nails/icon/icon@2x.png'),
            icon: false,
            onLast: true
        }));
});

//  Watches for changes in JS or less files and executes other tasks
gulp.task('default', function() {
    gulp.watch('assets/less/**/*.less', ['css']);
    gulp.watch('assets/js/**/*.js', ['js']);
});

//  Builds both CSS and JS
gulp.task('build', function() {
    runSequence(['css', 'js']);
});

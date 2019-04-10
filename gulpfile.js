/**
 * Nails Asset Gulpfile
 * Build tool for JS and CSS
 *
 * @todo Only process changed files
 */

// --------------------------------------------------------------------------

//  Configs
let watchCss = 'assets/less/*.less';
let watchJs = ['assets/js/*.js', '!assets/js/*.min.js', '!assets/js/*.min.js.map'];
let autoPrefixBrowsers = ['last 2 versions', 'ie 8', 'ie 9'];
let autoPrefixCascade = false;
let minifiedSuffix = '.min';
let sourcemapDest = './';
let sourcemapOptions = {includeContent: false};
let jsDest = './assets/js/';
let cssDest = './assets/css/';

//  Notifications
let cssSuccessTitle = 'Successfully compiled CSS';
let cssSuccessBody = '.less files were successfully compiled into CSS';
let cssSuccessSound = false;
let cssSuccessIcon = false;
let cssSuccessOnLast = true;

let jsSuccessTitle = 'Successfully compiled JS';
let jsSuccessBody = '.js files were successfully minified and sourcemaps created';
let jsSuccessSound = false;
let jsSuccessIcon = false;
let jsSuccessOnLast = true;

// --------------------------------------------------------------------------

//  Common
let gulp = require('gulp');
let plumber = require('gulp-plumber');
let notify = require('gulp-notify');
let path = require('path');

//  CSS
let less = require('gulp-less');
let autoprefixer = require('gulp-autoprefixer');
let minifyCss = require('gulp-minify-css');

//  JS
let sourcemaps = require('gulp-sourcemaps');
let uglify = require('gulp-uglify');
let rename = require('gulp-rename');
let jshint = require('gulp-jshint');

// --------------------------------------------------------------------------

let onError = function(err) {
    notify
        .onError({
            title: 'Check your Terminal',
            message: '<%= error.message %>',
            sound: 'Funk',
            contentImage: path.join(__dirname, 'assets/img/nails/icon/icon-red@2x.png'),
            icon: false,
            onLast: true
        })(err);
};

// --------------------------------------------------------------------------

/**
 * Watch for changes in LESS files and process on change
 */
gulp.task('watch:css', function() {
    gulp.watch('assets/less/**/*.less', gulp.series('css'));
});

// --------------------------------------------------------------------------

/**
 * Watch for changes in JS files and process on change
 */
gulp.task('watch:js', function() {
    gulp.watch(watchJs, gulp.series('js'));
});

// --------------------------------------------------------------------------

/**
 * Build CSS
 */
gulp.task('css', function() {

    //  CSS
    return gulp.src(watchCss)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(less())
        .pipe(autoprefixer({
            browsers: autoPrefixBrowsers,
            cascade: autoPrefixCascade
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest(cssDest))
        .pipe(notify({
            title: cssSuccessTitle,
            message: cssSuccessBody,
            sound: cssSuccessSound,
            contentImage: path.join(__dirname, 'assets/img/nails/icon/icon@2x.png'),
            icon: cssSuccessIcon,
            onLast: cssSuccessOnLast
        }));
});

// --------------------------------------------------------------------------

/**
 * Build both CSS and JS
 */
gulp.task('js', function() {

    //  JS
    return gulp.src(watchJs)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sourcemaps.init())
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(uglify())
        .pipe(rename({
            suffix: minifiedSuffix
        }))
        .pipe(sourcemaps.write(sourcemapDest, sourcemapOptions))
        .pipe(gulp.dest(jsDest))
        .pipe(notify({
            title: jsSuccessTitle,
            message: jsSuccessBody,
            sound: jsSuccessSound,
            contentImage: path.join(__dirname, 'assets/img/nails/icon/icon@2x.png'),
            icon: jsSuccessIcon,
            onLast: jsSuccessOnLast
        }));
});


// --------------------------------------------------------------------------

gulp.task('build', gulp.series('css', 'js'));
gulp.task('watch', gulp.series('watch:css', 'watch:js'));
gulp.task('default', gulp.series('watch:css', 'watch:js'));

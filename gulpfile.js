'use strict';

var gulp = require('gulp'),
    usemin = require('gulp-usemin'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect-php'),
    connectLocal = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    uncss = require('gulp-uncss'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    maps = require('gulp-sourcemaps'),
    del = require('del'),
    rename = require('gulp-rename'),
    compass = require('gulp-compass'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    critical = require('critical'),
    path = require('path'),
    runSequence = require('run-sequence'),
    minimist = require('minimist'),
    image = require('gulp-image'),
    modernizr = require('gulp-modernizr'),
    stripDebug = require('gulp-strip-debug'),
    config = require('./gulp-conf.json'),
    imagemin = require('gulp-imagemin'),
    eslint = require('gulp-eslint'),
    gulpIf = require('gulp-if'),
    minify = require('gulp-minify-css');


//not ideal but gets rid of that error about callback listeners
require('events').EventEmitter.prototype._maxListeners = 100;

//////////////////////////////////////////////////
//  Grab switches and env to determine our environment

var knownOptions = {
    string: 'env',
    default: {env: process.env.NODE_ENV || 'development'}
};
var options = minimist(process.argv.slice(2), knownOptions);

// process environment to get correct config
var base_config = config["base-config"];
config = config[options.env];
console.log("RUNNING IN " + options.env + " ENVIRONMENT");

//////////////////////////////////////////////////
// Cleaning tasks
//////////////////////////////////////////////////

gulp.task('clean-all', function () {
    del(['build', 'dist', '.sass-cache', 'tacticalsales/styles/css', 'tacticalsales/.sass-cache', 'tacticalsales/scripts/min/*', 'tacticalsales/scripts/all_scripts.js', 'tacticalsales/scripts/all_scripts.js.map', 'tacticalsales/tmp-*.css']);
});

gulp.task('clean', function () {
    del(['build', 'dist', 'tacticalsales/styles/css', 'tacticalsales/scripts/min/*', 'tacticalsales/styles/page-wise']);
});

gulp.task('clean-css', function () {
    del(['build', 'dist', 'tacticalsales/styles/css', 'tacticalsales/styles/page-wise']);
});

//////////////////////////////////////////////////

gulp.task('copyRootAssets', function () {
    var bldFolder = config["build_dir"];
    var srcFolder = config["src_dir"];
    if (options.env === 'production') {
        gulp.src([srcFolder + 'index.html']).pipe(gulp.dest(bldFolder));
        gulp.src([srcFolder + 'images/**/*']).pipe(gulp.dest(bldFolder + 'images'));
        gulp.src([srcFolder + 'js/*.js']).pipe(stripDebug()).pipe(gulp.dest(bldFolder + 'js'));
        gulp.src([srcFolder + 'css/**/*']).pipe(gulp.dest(bldFolder + 'css'));
    }
});

gulp.task('copyLanderAssets', function () {
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];

    if (options.env === 'production') {
        gulp.src([srcFolder + 'images/**/*']).pipe(image({svgo: false, zopflipng: false})).pipe(gulp.dest(bldFolder + 'images'));
        gulp.src([srcFolder + 'js/*.js']).pipe(stripDebug()).pipe(gulp.dest(bldFolder + 'js'));
        gulp.src([srcFolder + 'css/**/*']).pipe(gulp.dest(bldFolder + 'css'));
        gulp.src([srcFolder + 'plugins/**/*']).pipe(gulp.dest(bldFolder + 'plugins'));
        //handle our fonts todo:make this more elegant
        gulp.src([srcFolder + 'fonts/glyph*']).pipe(gulp.dest(bldFolder + 'fonts'));
        // Any special fonts you want in your files must go in the config file
        var dirz = base_config["fonts"];
        for (var i = 0, len = dirz.length; i < len; i++) {
            gulp.src([srcFolder + 'fonts/' + dirz[i] + '/*']).pipe(gulp.dest(bldFolder + 'fonts/' + dirz[i]));
        }

        //static pages
        gulp.src([srcFolder + 'partner.html']).pipe(gulp.dest(bldFolder));
        gulp.src([srcFolder + 'press.html']).pipe(gulp.dest(bldFolder));
        gulp.src([srcFolder + 'terms.html']).pipe(gulp.dest(bldFolder));
        gulp.src([srcFolder + 'privacy.html']).pipe(gulp.dest(bldFolder));
        gulp.src([srcFolder + 'customercare.html']).pipe(gulp.dest(bldFolder));
    }
});

// uncss a custom bootstrap
gulp.task("stripBootstrap", function () {
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];
    return gulp.src(srcFolder + 'css/bootstrap.css')
        .pipe(uncss({
            html: [srcFolder + '*.html'],
            ignore: [/wistia/]
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(bldFolder + 'styles/css'));
});

// process critical stuff
gulp.task('criticalLoop', function () {
    process.setMaxListeners(0);
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];


    if (options.env === 'production') {
        gulp.src([srcFolder + '*.html']).pipe(gulp.dest(bldFolder));
    }

    if (false) {
        // Any files you want compiled shoudl go in the config file
        var filez = base_config["compile-html"];
        for (var i = 0; i < filez.length; i++) {
            console.log(srcFolder + '_' + filez[i] + '.html' + '->' + bldFolder + filez[i] + '.html');

            critical.generate({
                inline: true,
                base: srcFolder,
                src: '_' + filez[i] + '.html',
                dest: bldFolder + filez[i] + '.html',
                width: 1400,
                height: 800,
                ignore: ['@font-face', /url\(/],
                minify: true
            });
        }
    }
});

//////////////////////////////////////////////////
// ESLint
//////////////////////////////////////////////////

function isFixed(file) {
    // Has ESLint fixed the file contents?
    return file.eslint != null && file.eslint.fixed;
}

gulp.task('lintfix', () => {
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];

    return gulp.src(srcFolder + 'scripts/*.js')
        .pipe(eslint({
            fix: true
        }))
        .pipe(eslint.format())
        // if fixed, write the file to dest
        .pipe(gulpIf(isFixed, gulp.dest(srcFolder + 'scripts/fixed_js')));
});

gulp.task('lint', () => {
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];
    
    return gulp.src(srcFolder + 'scripts/*.js')
        // eslint() attaches the lint output to the "eslint" property 
        // of the file object so it can be used by other modules. 
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console. 
        // Alternatively use eslint.formatEach() (see Docs). 
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on lint error, return the stream and pipe to failAfterError last. 
        .pipe(eslint.failAfterError());
});

//////////////////////////////////////////////////
// minify everything in js
//////////////////////////////////////////////////

gulp.task('genCommonJS', function () { // generate our common js
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];

    if (options.env === 'production') {
        return gulp.src([
                srcFolder + 'scripts/library/jQuery/jquery.mask.min.js',
                srcFolder + 'scripts/library/tether.min.js', 
                srcFolder + 'scripts/library/formValidation/formValidation.min.js', 
                srcFolder + 'scripts/library/formValidation/bootstrap4.min.js', 
                srcFolder + 'scripts/library/bootstrap-v4-a3.min.js', 
                srcFolder + 'scripts/library/mailcheck.min.js', 
                srcFolder + 'scripts/library/addclear.min.js', 
                srcFolder + 'scripts/library/fastclick.js', 
                srcFolder + 'scripts/library/haschange.min.js', 
                srcFolder + 'scripts/library/*.js'])
            .pipe(concat('all-common.min.js'))
            .pipe(stripDebug())
            .pipe(gulp.dest(bldFolder + 'scripts/min'));
    } else {
        return gulp.src([
                srcFolder + 'scripts/library/jQuery/jquery.mask.min.js',
                srcFolder + 'scripts/library/tether.min.js', 
                srcFolder + 'scripts/library/formValidation/formValidation.min.js', 
                srcFolder + 'scripts/library/formValidation/bootstrap4.min.js', 
                srcFolder + 'scripts/library/bootstrap-v4-a3.min.js', 
                srcFolder + 'scripts/library/mailcheck.min.js', 
                srcFolder + 'scripts/library/addclear.min.js', 
                srcFolder + 'scripts/library/fastclick.js', 
                srcFolder + 'scripts/library/haschange.min.js', 
                srcFolder + 'scripts/library/*.js'])
            .pipe(concat('all-common.min.js'))
            .pipe(gulp.dest(bldFolder + 'scripts/min'));
    }
});

gulp.task("minifyScripts", function () {
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];

    if (options.env === 'production') {
        return gulp.src(srcFolder + "scripts/*.js")
            .pipe(plumber())
            .pipe(stripDebug())
            .pipe(uglify())
            .pipe(gulp.dest(bldFolder + 'scripts/min'))
            .pipe(livereload())
            .pipe(browserSync.stream());
    } else {
        return gulp.src(srcFolder + "scripts/*.js")
            .pipe(plumber())
//          .pipe(uglify())
            .pipe(gulp.dest(bldFolder + 'scripts/min'))
            .pipe(livereload())
            .pipe(browserSync.stream());
    }
});

gulp.task('modernizr', function() {
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];

    gulp.src(srcFolder + 'styles/sass/*.scss')
        .pipe(modernizr('modernizr-custom.js'))
        .pipe(uglify())
        .pipe(gulp.dest(bldFolder + "/scripts/min/"));
});

gulp.task('minifyingImages', function() {
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];

    if (options.env === 'production') {
        gulp.src([srcFolder + 'src_images/**/*'])
            .pipe(imagemin())
            .pipe(gulp.dest(bldFolder + 'images'));
    }
    else
    {
        gulp.src([srcFolder + 'src_images/**/*'])
            .pipe(imagemin())
            .pipe(gulp.dest(bldFolder + 'images'));
    }
});

//////////////////////////////////////////////////
// CSS Optimizations
//////////////////////////////////////////////////

gulp.task('compileCompass', function () { // combine sass and css to build path
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];
    return gulp.src(srcFolder + 'styles/sass/*.scss')
        .pipe(plumber())
        .pipe(compass({
            config_file: srcFolder + 'config.rb',
            css: srcFolder + 'styles/css',
            sass: srcFolder + 'styles/sass'
        }))
        .pipe(cleanCSS())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(bldFolder + 'styles/css'))
        .pipe(livereload())
        .pipe(browserSync.stream());
});

gulp.task('packCSS-hlmp', function () {
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];

    return gulp.src([
            srcFolder + 'styles/css/lmp.css', 
            srcFolder + 'styles/css/loading-bar.css',
            srcFolder + 'styles/css/common.css'
            ])
        .pipe(concat("hlmp-page.min.css"))
        .pipe(minify())
        .pipe(gulp.dest(bldFolder + 'styles/page-wise'));
});

gulp.task('packCSS-headlampoffer', function () {
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];

    return gulp.src([
            srcFolder + 'styles/library/bootstrap-v4-a3.min.css', 
            srcFolder + 'styles/css/us_headlampoffer.css'
            ])
        .pipe(concat("headlampoffer-page.min.css"))
        .pipe(minify())
        .pipe(gulp.dest(bldFolder + 'styles/page-wise'));
});

gulp.task('packCSS-batteryoffer', function () {
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];

    return gulp.src([
            srcFolder + 'styles/library/bootstrap-v4-a3.min.css', 
            srcFolder + 'styles/css/us_batteryoffer.css'
            ])
        .pipe(concat("batteryoffer-page.min.css"))
        .pipe(minify())
        .pipe(gulp.dest(bldFolder + 'styles/page-wise'));
});

gulp.task('packCSS-checkout', function () {
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];

    return gulp.src([
            srcFolder + 'styles/library/bootstrap-v4-a3.min.css', 
            srcFolder + 'styles/css/checkout.css', 
            srcFolder + 'styles/library/formValidation.min.css', 
            srcFolder + 'styles/library/normalize.css', 
            srcFolder + 'styles/library/intlTelInput.css'
            ])
        .pipe(concat("checkout-page.min.css"))
        .pipe(minify())
        .pipe(gulp.dest(bldFolder + 'styles/page-wise'));
});

gulp.task('packCSS-tm3', function () {
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];

    return gulp.src([
            srcFolder + 'styles/library/bootstrap-v4-a3.min.css', 
            srcFolder + 'styles/css/tm3.css'
            ])
        .pipe(concat("tm3-page.min.css"))
        .pipe(minify())
        .pipe(gulp.dest(bldFolder + 'styles/page-wise'));
});

//////////////////////////////////////////////////

gulp.task('browser-sync', function () {
    connect.server({}, function () {
        browserSync({
            proxy: 'localhost:8000'
        });
    });

    gulp.watch('**/*.php').on('change', function () {
        browserSync.reload();
    });
});

//////////////////////////////////////////////////

gulp.task('watchFiles', function () {
    var srcFolder = config["src_dir"] + config["checkout_dir"];

    var server = livereload();

    gulp.start('browser-sync');

    gulp.watch(srcFolder + 'styles/sass/**/*.scss', ['compileCompass', 'criticalLoop']);
    gulp.watch(srcFolder + 'scripts/*.js', ['minifyScripts', 'genCommonJS', 'criticalLoop']);
    gulp.watch(srcFolder + '_*.html', ['criticalLoop']);
    // gulp.watch('*.jade', ['compileJade']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

//////////////////////////////////////////////////

gulp.task("default", function (callback) {
    gulp.start('build');
    gulp.start('serve');
});

gulp.task("genStyleSheets", function(done) {
    runSequence(
        'clean-css',
        'compileCompass',
        'packCSS-hlmp',
        'packCSS-headlampoffer',
        'packCSS-batteryoffer',
        'packCSS-checkout', 
        'packCSS-tm3',

        function () {
            console.log('Generated stylesheets!');
            done();
        }
    );
});

gulp.task("build", function(done) {
    runSequence(
        'clean',
        'genStyleSheets',
        'genCommonJS',
        'minifyScripts',
        'modernizr',
        'criticalLoop',
        'minifyingImages', 
        'copyRootAssets',
        function() {
            console.log('Complete Build!');
            done();
        });
});

gulp.task("serve", function (callback) {    
    connectLocal.server({
        port: 9001
    });
});

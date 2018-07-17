'use strict';

var gulp = require('gulp'),
    usemin = require('gulp-usemin'),
    concat = require('gulp-concat'),
// jade = require('gulp-jade'),
    connect = require('gulp-connect-php'),
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
    config = require('./gulp-conf.json');


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
// Time for tasks!

gulp.task('clean', function () {
    del(['build', 'dist', 'styles/css', 'scripts/min/*', 'scripts/all_scripts.js', 'scripts/all_scripts.js.map']);
});

// build task
gulp.task("build", ['clean'], function (callback) {

    runSequence(
        'compileCompass',
        'genCommonJs',
        'minifyScripts',
        'modernizr',
        'criticalLoop',
        'copyLanderAssets',
        'copyRootAssets',
        'sayHello',
        callback);
});


gulp.task('sayHello',['copyLanderAssets'], function () {
    console.log("hello i am done");
});

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

gulp.task('copyLanderAssets',['criticalLoop'], function () {

    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];

    if (options.env === 'production') {

        gulp.src([srcFolder + 'images/**/*']).pipe(image({svgo: false,zopflipng: false})).pipe(gulp.dest(bldFolder + 'images'));
//        gulp.src([srcFolder + 'images/**/*']).pipe(gulp.dest(bldFolder + 'images'));

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

// combine sass and css to build path
gulp.task('compileCompass', function () {
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];
    return gulp.src(srcFolder + 'styles/sass/*.scss')
        .pipe(plumber())
        .pipe(compass({
            config_file: srcFolder + 'config.rb',
            css: srcFolder + 'styles/css',
            sass: srcFolder + 'styles/sass'
        }))

//        .pipe(uncss({
//            html: [srcFolder + '_*.html'],
//            ignore: [/wistia/, /segment/]
//        }))
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

// generate our common js
gulp.task('genCommonJs', function () {
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];

    if (options.env === 'production') {
        return gulp.src([srcFolder + 'scripts/dist/tingle.js', srcFolder + 'scripts/dist/memorystorage.js', srcFolder + 'scripts/dist/minAjax.js', srcFolder + 'scripts/dist/fastclick.js',
                srcFolder + 'scripts/dist/detectmobilebrowser.js', srcFolder + 'scripts/dist/platform.js'])
            .pipe(concat('all-common.js'))
            .pipe(stripDebug())
            .pipe(uglify())
            .pipe(gulp.dest(bldFolder + 'scripts/min'));
    } else {
        return gulp.src([srcFolder + 'scripts/dist/tingle.js', srcFolder + 'scripts/dist/memorystorage.js', srcFolder + 'scripts/dist/minAjax.js', srcFolder + 'scripts/dist/fastclick.js',
                srcFolder + 'scripts/dist/detectmobilebrowser.js', srcFolder + 'scripts/dist/platform.js'])
            .pipe(concat('all-common.js'))
            .pipe(uglify())
            .pipe(gulp.dest(bldFolder + 'scripts/min'));
    }
});

// minify everything in js
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
            .pipe(uglify())
            .pipe(gulp.dest(bldFolder + 'scripts/min'))
            .pipe(livereload())
            .pipe(browserSync.stream());
    }
});

//process critical stuff
gulp.task('criticalLoop',['compileCompass', 'genCommonJs', 'minifyScripts'], function () {
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];

    // Any files you want compiled shoudl go in the config file
    var filez = base_config["compile-html"];
    for (var i = 0, len = filez.length; i < len; i++) {
        console.log(srcFolder + '_' + filez[i] + '.html' + '->' + bldFolder+filez[i] + '.html');
        if (true) {
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
        } else {
            gulp.src(srcFolder + '_' + filez[i] + '.html').pipe(rename(filez[i] + '.html')).pipe(gulp.dest(bldFolder));
        }
    }
});


//////////////////////////////////////////////////

gulp.task('modernizr', function() {
    var bldFolder = config["build_dir"] + config["lander_dir"];
    var srcFolder = config["src_dir"] + config["checkout_dir"];

    gulp.src(srcFolder + 'styles/sass/*.scss')
        .pipe(modernizr('modernizr-custom.js'))
        .pipe(uglify())
        .pipe(gulp.dest(bldFolder + "/scripts/min/"));
});

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

// gulp.task('compileJade', function() {
//   var YOUR_LOCALS = {};

//   gulp.src('./*.jade')
//     .pipe(jade({
//       locals: YOUR_LOCALS,
//       pretty: true
//     }))
//     .pipe(gulp.dest('./'))
//     .pipe(livereload())
//     .pipe(browserSync.stream());
// });


//////////////////////////////////////////////////

gulp.task('watchFiles', function () {
    var srcFolder = config["src_dir"] + config["checkout_dir"];

    var server = livereload();

    gulp.start('browser-sync');

    gulp.watch(srcFolder + 'styles/sass/**/*.scss', ['compileCompass', 'criticalLoop']);
    gulp.watch(srcFolder + 'scripts/*.js', ['minifyScripts', 'genCommonJs', 'criticalLoop']);
    gulp.watch(srcFolder + '_*.html', ['criticalLoop']);
    // gulp.watch('*.jade', ['compileJade']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

//////////////////////////////////////////////////

gulp.task('serve', ['watchFiles']);

//////////////////////////////////////////////////
gulp.task("default", function (callback) {
    gulp.start('build');
    gulp.start('serve');
});

gulp.task("local", function (callback) {
    gulp.start('build');
    connectLocal.server({
        port: 9001
    });
});


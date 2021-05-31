const gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    cssmin = require('gulp-cssmin'),
    csso = require('gulp-csso'),
    del = require('del'),
    fs = require('fs'),
    handlebars = require('gulp-compile-handlebars'),
    imagemin = require('gulp-imagemin'),
    merge = require('merge-stream'),
    notify = require('gulp-notify'),
    path = require('path'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    responsive = require('gulp-responsive-images'),
    sitemap = require('gulp-sitemap'),
    size = require('gulp-size'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    uncss = require('gulp-uncss'),
    watch = require('gulp-watch'),
    webp = require('gulp-webp'),
    sass = require('gulp-dart-sass'),
    sassdoc = require('sassdoc'),
    bump = require('gulp-bump'),
    axe = require('gulp-axe-cli'),
    ts = require('gulp-typescript'),
    hb = require('gulp-hb'),
    workboxBuild = require('workbox-build');


const {
    series
} = require('gulp');


/************************/

var getFolders = function (dir) {
    var folders = [{
        path: '',
        name: 'main'
    }];
    var folder = fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
    for (let i = 0; i < folder.length; i++) {
        folders.push({
            path: folder[i],
            name: folder[i]
        });
    }
    return folders;
};

/************************/

function clean_destination() {
    return del(['./dist/']);
};

/************************/

function clean_imageCache(callback) {
    return cache.clearAll(callback)
};

/************************/

function do_bump_patch(done) {
    gulp.src('./package.json')
        .pipe(bump({
            type: 'patch'
        }))
        .pipe(gulp.dest('./'));
    done();
};

/************************/

function do_bump_minor(done) {
    gulp.src('./package.json')
        .pipe(bump({
            type: 'minor'
        }))
        .pipe(gulp.dest('./'));
    done();
};

/************************/

function do_bump_major(done) {
    gulp.src('./package.json')
        .pipe(bump({
            type: 'major'
        }))
        .pipe(gulp.dest('./'));
    done();
};

/************************/

function copy_rootAndHtmlPages(done) {
    gulp.src(['./source/*.*', './source/**/*.html'])
        .pipe(size())
        .pipe(gulp.dest('./dist/'))
        .pipe(notify({
            title: '>> Root and html pages copied <<',
            message: 'task complete',
            onLast: true,
            sound: 'Submarine'
        }));
    done();
};

/************************/


function process_handlebars(done) {
    return gulp.src('./source/content/**/*.handlebars')
        .pipe(hb({
                debug: false
            })
            .partials('./source/patterns/**/*.handlebars')
            .helpers('./source/helpers/**/*.js')
            .data('./source/data/**/*.json')
        )
        .pipe(rename(function (path) {
            path.extname = ".html"
        }))
        .pipe(axe())
        .pipe(gulp.dest('./dist/'))
        .pipe(notify({
            title: '>> Handlebars processed <<',
            message: 'task complete',
            onLast: true
        }))
        .pipe(connect.reload());
    done();
};


/******* =scripts *****************/


function process_typescript(done){
        return gulp.src('src/**/*.ts')
            .pipe(ts({
                noImplicitAny: true,
                outFile: 'output.js'
            }))
            .pipe(gulp.dest('./dist/scripts'));

        done();
}

function process_scripts(done) {
    var folders = getFolders('./source/scripts/');

    var tasks = folders.map(function (folder) {
        if (folder.name === 'vendor') {
            return gulp.src('./source/scripts/vendor/*.js')
                .pipe(gulp.dest('./dist/scripts/vendor'));

        } else {
            return gulp.src(path.join('./source/scripts/', folder.path, '/*.js'))
                // .pipe(size({showFiles : true}))
                .pipe(sourcemaps.init())
                .pipe(babel({
                    presets: ["@babel/preset-env"]
                }))
                .pipe(concat(folder.name + '.js'))
                .pipe(gulp.dest('./dist/scripts'))
                .pipe(uglify())
                .pipe(concat(folder.name + '.min.js'))
                .pipe(sourcemaps.write('../maps'))
                .pipe(gulp.dest('./dist/scripts'))
                .pipe(connect.reload())
                .pipe(notify({
                    title: '>> Scripts processed <<',
                    message: 'task complete',
                    onLast: true,
                    sound: 'Bottle'
                }));
        }
    });
    merge(tasks);
    done();

};

/********* =styles ***************/

function process_styles(done) {
    return gulp.src('./source/styles/**/*.scss')
        .pipe(sassdoc())
        .pipe(sass())
        // .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(autoprefixer('last 4 version'))
        .pipe(sourcemaps.init())
        // .pipe(size({showFiles : true}))
        .pipe(gulp.dest('./dist/styles'))
        .pipe(csso())
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('./dist/styles'))
        // .pipe(size())
        .pipe(connect.reload())
        .pipe(notify({
            title: '>> Styles processed <<',
            message: 'task complete',
            onLast: true,
            sound: 'Blow'
        }));
    done();
};

function clean_styles(done) {
    return gulp.src('./dist/styles/main.css')
        .pipe(csso())
        .pipe(rename({
            suffix: '.clean'
        }))
        .pipe(gulp.dest('./dist/styles'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cssmin())
        .pipe(gulp.dest('./dist/styles'))
        // .pipe(connect.reload())
        .pipe(notify({
            title: '>> Styles cleaned <<',
            message: 'task complete',
            onLast: true,
            sound: 'Blow'
        }));
};

/********* =images ***************/

function process_images(done) {
    return gulp.src('source/images/**/*')
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('./dist/images'))
        .pipe(size())
        .pipe(connect.reload())
        .pipe(notify({
            title: '>> Images processed <<',
            message: 'task complete',
            onLast: true,
            sound: 'Frog'
        }));
    done();
};

function do_imagesResponsive(done) {
    gulp.src('source/images/**/*')
        .pipe(responsive({
            '*.*': [{
                width: 300,
                upscale: false,
                suffix: '-300px'
            }, {
                width: 300,
                height:300,
                suffix: '-crop-300px',
                crop: true,
                gravity: 'Center',
            }, {
                width: 500,
                upscale: false,
                suffix: '-500px'
            }, {
                width: 700,
                upscale: false,
                suffix: '-700px'
            }, {
                width: 700,
                upscale: false,
                crop: true,
                suffix: '-700px-crop',
                gravity: 'Center'
            }, {
                width: 900,
                upscale: false,
                suffix: '-900px'
            }, {
                width: 1100,
                upscale: false,
                suffix: '-1100px'
            }, {
                width: 1300,
                upscale: false,
                suffix: '-1300px'
            }, {
                width: 1500,
                upscale: false,
                suffix: '-1500px'
            }, {
                width: 1700,
                upscale: false,
                suffix: '-1700px'
            }, {
                width: '100%',
                suffix: '@1x'
            }, {
                width: '200%',
                suffix: '@2x'
            }, {
                width: '300%',
                suffix: '@3x'
            }, {
                width: '400%',
                suffix: '@4x'
            }]
        }))
        .pipe(gulp.dest('./dist/images'))
        .pipe(webp())
        .pipe(gulp.dest('dist/images'));
    done();
};

/********** =copy assets **************/

function do_copyAssets(done) {
    gulp.src(['./source/fonts/**/*']).pipe(gulp.dest('./dist/fonts'));
    done();

};

/********** =watch **************/

function do_watch(done) {

    gulp.watch("./source/styles/**/*.scss", process_styles);
    gulp.watch("./source/scripts/**/*", process_scripts);
    gulp.watch("./source/images/**/*", process_images);
    gulp.watch("./source/**/*.handlebars", process_handlebars);
    gulp.watch("./source/**/*.json", process_handlebars);
    done();

};

/******** =connect ****************/

function do_connect(done) {
    connect.server({
        name: 'Dev App',
        root: ['./dist/'],
        port: 8000,
        livereload: true
    });
    done();
};

/******* =makesitemap *****************/

function make_sitemap(done) {
    gulp.src('./dist/**/*.html', {
            read: false
        })
        .pipe(sitemap({
            siteUrl: 'http://www.amazon.com'
        }))
        .pipe(gulp.dest('./dist'));
    done();
};

/******************************/

const buildSW = () => {
    // This will return a Promise
    return workboxBuild.generateSW({
      globDirectory: 'dist',
      globPatterns: [
        '**/*.{html,json,js,css}',
      ],
      swDest: 'dist/sw.js',
    });
  };

/******************************/


exports.start = series(
    do_bump_patch,
    clean_destination,
    copy_rootAndHtmlPages,
    process_handlebars,
    process_styles,
    clean_styles,
    process_scripts,
    process_images,
    do_copyAssets,
    do_imagesResponsive,
    do_connect,
    do_watch);

exports.default = series(
    clean_destination,
    copy_rootAndHtmlPages,
    process_handlebars,
    process_styles,
    process_scripts,
    process_images,
    do_copyAssets,
    do_imagesResponsive,
    do_connect)

/******************************/


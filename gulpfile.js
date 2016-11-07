var gulp = require('gulp');
var inject = require('gulp-inject');
var del = require('del');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var wiredep = require('wiredep').stream;
var angularFilesort = require('gulp-angular-filesort');

var config = {
    injectOptions: {
        relative: true
    },
    paths: {
        index: './client/index.html',
        dist: './dist/'
    }
}

gulp.task('clean', function () {
    return del.sync(config.paths.dist + '/*');
});

gulp.task('index', function () {
    var target = gulp.src(config.paths.index);

    var sources = gulp.src(['./client/app/**/*.html', './client/assets/styles/**/*.css'], {
        read: false
    });

    var jsSources = gulp.src(['./client/app/**/*.js'])
        .pipe(angularFilesort()).on('error', function (err) {
            console.log(err);
        });


    var wiredepOptions = {
        ignorePath: '../bower_components',
        fileTypes: {
            html: {
                replace: {
                    js: '<script src="/assets/js/vendor{{filePath}}"></script>'
                }
            }
        }
    }

    return target.pipe(inject(jsSources, config.injectOptions))
        .pipe(inject(sources, config.injectOptions))
        .pipe(wiredep(wiredepOptions)) //bower 3rd parties
        .pipe(gulp.dest('./dist'));
});

//For server hosting use BrowserSync
gulp.task('browserSync', function () {
    browserSync.init({
        notify: false,
        server: {
            baseDir: config.paths.dist,
        }
    });
});

gulp.task('updateFiles', ['clean', 'copyCSS', 'copyTemplates', 'copyJS'], function () {
    browserSync.reload;
});

//TODO: not working
gulp.task('serve', ['build', 'browserSync'], function () {

    gulp.watch(config.paths.index, ['index']); //TODO: reload
    gulp.watch('./client/assets/styles/*.css', ['updateFiles']);
    gulp.watch('./client/app/**/*.html', ['updateFiles']);
    gulp.watch('./client/app/**/*.js', ['updateFiles']);

});

//This sub-task pipes the images to dist folder
gulp.task('copyImages', function () {
    return gulp.src('./client/assets/images/**/*')
        .pipe(gulp.dest(config.paths.dist + '/assets/images'));
});

gulp.task('copyCSS', function () {
    return gulp.src('./client/assets/styles/*.css')
        .pipe(gulp.dest(config.paths.dist + '/assets/styles'));
});

gulp.task('copyVendorJS', function () {
    return gulp.src('bower_components/**/*.js')
        .pipe(gulp.dest(config.paths.dist + '/assets/js/vendor'));
});

gulp.task('copyJS', function () {
    return gulp.src('./client/app/**/*.js')
        .pipe(gulp.dest(config.paths.dist + '/app'));
});

gulp.task('copyTemplates', function () {
    return gulp.src('./client/app/**/*.html')
        .pipe(gulp.dest(config.paths.dist + '/app'));
});

gulp.task('build', function (callback) {
    runSequence('clean', ['index', 'copyImages', 'copyCSS', 'copyJS', 'copyTemplates', 'copyVendorJS'],
        callback
    );
});


gulp.task('default', ['serve']);
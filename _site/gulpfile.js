var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const flatten = require('gulp-flatten');
var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};
const cleanCss = require('gulp-clean-css');
const buffer = require('vinyl-buffer');
const minify  = require('gulp-babel-minify');
const deploy = require('gulp-gh-pages');
const paths = {
  js: '_js/main.js',
}

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'js', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('_scss/main.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify,
            errLogToConsole: true,
        }))
        .on('error', sass.logError)
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('_site'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('./'))
});

gulp.task('js', () => {
  return browserify(paths.js)
    .transform('babelify', {
      presets: ['import-export'],
      global: true,
    })  
    .bundle()
    .on('error', function(err) {
      console.log(err.message);
      this.emit('end');
    })
    .pipe(source(paths.js))
    .pipe(flatten())
    .pipe(gulp.dest('_site'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('./'))
})

gulp.task('css-prod', function () {
  return gulp.src('_site/main.css', { base: './' })
    .pipe(cleanCss())
    .pipe(gulp.dest('.'))
});

gulp.task('js-prod', () => {
  return browserify({
      entries: ['node_modules/babel-polyfill', paths.js],
    })
    .transform('babelify', {
      presets: ['env'],
      global: true,
    })
    .bundle()
    .on('error', function(err) {
      console.log(err.message);
      this.emit('end');
    })
    .pipe(source(paths.js))
    .pipe(buffer())
    .pipe(flatten())
    .pipe(minify())
    .pipe(gulp.dest('_site'))
})

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('_scss/**/*.scss', ['sass']);
    gulp.watch(paths.js, ['js']);
    gulp.watch(['pages/*.html', '_layouts/*.html', '_posts/*', '_includes/*.html', '_includes/**/*.svg'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);

gulp.task('prod', ['css-prod', 'js-prod']);

gulp.task('deploy', ['prod'], function () {
    return gulp.src('./_site/**/*')
        .pipe(deploy());
});

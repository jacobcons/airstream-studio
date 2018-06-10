var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const flatten = require('gulp-flatten');
const deploy = require('gulp-gh-pages');
var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

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
gulp.task('browser-sync', ['jekyll-build', 'sass', 'js'], function() {
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
  return browserify('_js/main.js')
    .transform('babelify', {
      presets: ['import-export'],
      global: true,
    })  
    .bundle()
    .on('error', function(err) {
      console.log(err.message);
      this.emit('end');
    })
    .pipe(source('_js/main.js'))
    .pipe(flatten())
    .pipe(gulp.dest('_site'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('./'))
})

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('_scss/**/*.scss', ['sass']);
    gulp.watch('_js/main.js', ['js']);
    gulp.watch(['pages/*.html', '_layouts/*.html', '_posts/*', '_includes/*.html', '_includes/**/*.svg'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);

gulp.task('deploy', ['jekyll-build', 'css-prod', 'js-prod'], function () {
    return gulp.src('./_site/**/*')
        .pipe(deploy());
});

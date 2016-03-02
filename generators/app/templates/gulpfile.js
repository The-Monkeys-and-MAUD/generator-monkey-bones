/*    
     .-"-.            .-"-.            .-"-.           .-"-.
   _/_-.-_\_        _/.-.-.\_        _/.-.-.\_       _/.-.-.\_
  / __} {__ \      /|( o o )|\      ( ( o o ) )     ( ( o o ) )
 / //  "  \\ \    | //  "  \\ |      |/  "  \|       |/  "  \|
/ / \'---'/ \ \  / / \'---'/ \ \      \'/^\'/         \ .-. /
\ \_/`"""`\_/ /  \ \_/`"""`\_/ /      /`\ /`\         /`"""`\
 \           /    \           /      /  /|\  \       /       \


The Monkeys (c) 2016 | http://themonkeys.com.au/ 
Date: 15/1/16

@author Lachlan Tweedie, lachlant@themonkeys.com.au

*/

var gulp         = require('gulp'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    sass         = require('gulp-sass'),
    less         = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS    = require('gulp-clean-css'),
    browserSync  = require('browser-sync'),
    watch        = require('gulp-watch'),
    batch        = require('gulp-batch'),
    path         = require('path'),
    inject       = require('gulp-inject'),
    changed      = require('gulp-changed'),
    notify        = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    jshint        = require('gulp-jshint'),
    ngAnnotate    = require('gulp-ng-annotate') 
    combiner = require('stream-combiner2');


var PORT = process.env.PORT || 3000;
var PUBLIC_DIR = path.join('build');
var combine = combiner.obj;
var supported_browsers = ['last 2 versions', 'ie >= 9', 'Opera >= 30', 
                    'Chrome >= 40', 'Firefox >= 35', 'Safari >= 6', 
                    'Android >= 4' , '> 80%']

// constants 

var BASE_PATH = 'build',

// build js list 

FILE_LIST_JS =  [   BASE_PATH + '/js/vendor/jquery-1.11.1.min.js', 
                    BASE_PATH + '/js/vendor/tweenmax.js' 
                ];

// boostrap check

if(false){
  FILE_LIST_JS.push(BASE_PATH + '/public/libs/bootstrap/bootstrap.min.js')
}


/*

  Sass compiler

*/

gulp.task('sass', function () {

  return gulp.src(BASE_PATH + '/scss/*.scss')
    .pipe(sass().on('error', sass.logError)) // sass -> css
    .pipe(autoprefixer({                      // prefix css
        browsers: supported_browsers, 
        cascade: false
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest( BASE_PATH + '/public/css' ))            
    .pipe(browserSync.reload({stream:true}));

});

/*

  Less compiler

*/

gulp.task('less', function() {
  
  var tasks = combine([
    gulp.src(BASE_PATH + '/less/*.less'),  // get the less file that imports all other files
    less(),                               // compile less -> css
    autoprefixer({                        // prefix for browser compatability
        browsers: supported_browsers, 
        cascade: false
    }),                     
    cleanCSS({compatibility: 'ie8'}),      // minify css
    gulp.dest(BASE_PATH + '/public/css') // save file
  ]);

  tasks
    .on('error', console.error.bind(console))
    .on('end', function() {
      browserSync.reload({stream:true})
    });

  return tasks;
  
});

/*

  JS Linting to prevent crashes.

*/

gulp.task('lint', function() {
    gulp.src(BASE_PATH + "/js/*.js")
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        
});

/*

  Javascript

*/

gulp.task('vendorJs', function () {
    return gulp.src(FILE_LIST_JS)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())    
    .pipe(gulp.dest(BASE_PATH + '/public/js/vendor'));
});

gulp.task('js', function () {

    var onError = function(err) {

        var e = err;

        e.lineError = err.message.split("\n")[1];
        e.file = err.message.split(":")[0];

        notify.onError({
                    title:    "Gulp",
                    subtitle: "Error!",
                    message: "<%= error.file %>" + ": " + "<%= error.lineError %>",
                    sound:    "Beep"
                })(e);


        console.log(" ");
        this.emit('end');
    };

    return gulp.src(BASE_PATH + "/js/*.js")
      .pipe(plumber({errorHandler: onError}))
      .pipe(changed(BASE_PATH + '/public/js'))
      .pipe(ngAnnotate())
      .pipe(uglify())  
      .pipe(gulp.dest(BASE_PATH + '/public/js'));
});

gulp.task('watch', function() {
  
  gulp.watch('build/**/*.js', ['lint', 'js', 'bs-reload']);
  gulp.watch('build/**/*.html', ['bs-reload']);
  gulp.watch('build/**/*.scss', ['sass']);

});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: './build/public/',
      index: 'index.html'
    }
  });
});

gulp.task('default', ['sass', 'vendorJs', 'js', 'watch', 'server']);
gulp.task('build', ['sass', 'js']);

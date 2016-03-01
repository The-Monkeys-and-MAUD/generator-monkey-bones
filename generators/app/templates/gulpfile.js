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

@author <%= author %>, <%= email %>

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
    changed       = require('gulp-changed'),
    ngAnnotate    = require('gulp-ng-annotate'); 

var livereload = require('gulp-livereload');
var combiner = require('stream-combiner2');


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

if(<%= hasBootstrap %>){
  FILE_LIST_JS.push(BASE_PATH + '/public/libs/bootstrap/bootstrap.min.js')
}



/* ------------------------------
  
  Style compilers

------------------------------ */ 


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

  Javascript

*/

gulp.task('vendorJs', function () {
    return gulp.src(FILE_LIST_JS)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())    
    .pipe(gulp.dest(BASE_PATH + '/public/js/vendor'));
});

gulp.task('js', function () {
    return gulp.src(BASE_PATH + "/js/*.js")  
      .pipe(changed(BASE_PATH + '/public/js'))
      .pipe(ngAnnotate())
      .pipe(uglify())  
      .pipe(gulp.dest(BASE_PATH + '/public/js'));
});



gulp.task('indexAddSrcs', function () {
  var target = gulp.src('./build/index.html');
  var sources = gulp.src( ['build/js/vendor/*.js','build/css/vendor/*.css'] , {read: false} );
  return target.pipe(inject(sources))
    .pipe(gulp.dest('./build'));

});



gulp.task('watch', function() {
  
  // livereload.listen();

  gulp.watch('build/**/*.js', ['js', 'bs-reload']);
  gulp.watch('build/**/*.html', ['bs-reload']);
  gulp.watch('build/**/*.<%= stylingExt %>', ['<%= styling %>']);


});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('server', function() {
  // server.listen(PORT || 3000, function() {
  //   console.log('Server listening on port', PORT);
  // });
  browserSync({
    server: {
      baseDir: './build/public/',
      index: 'index.html'
    }
  });

});

gulp.task('default', ['<%= styling %>', 'vendorJs', 'js', 'watch', 'server']);
gulp.task('build', ['<%= styling %>', 'js']);

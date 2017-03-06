/*****************************************

  USING GULP TO BUILD A FRONT END WEBSITE
  
This app is used to :
- Concatenate and minify the JavaScript files
- Compile SCSS into CSS in a concatenated and minified file
- Generate JavaScript and CSS source maps
- Compress any JPEG or PNG files
  
******************************************/


/*
A few variables
gulp
uglify
sass
maps
imageop
concat
del
connect
eslint
gif
*/
var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
 imageop = require('gulp-image'),
  concat = require('gulp-concat'),
     del = require('del'),
 connect = require('gulp-connect'),
  eslint = require('gulp-eslint'),
     gif = require('gulp-if');
 
/*
Options for the app :
src, for the source files
dist for the output folder
port for the port to listen on
lint if you want to use lint in your app
minify if you want to minify your .js files, usefull for dev.
maps if you want to create maps files
*/
var options = {
		src: 'src',
		dist: 'dist',
		port: 3000,
		lint: false,
		minify: true,
		maps: true};

//The scripts task concats all .js files in one file, and if you set the options true,
//this task will also minifys, lints your .js files, and create maps files
gulp.task('scripts', function() {
	return gulp.src(options.src + "/js/**/*.js")
		.pipe(gif(options.maps, maps.init()))
		.pipe(concat('all.min.js'))
		.pipe(gif(options.minify, uglify()))
		.pipe(gif(options.lint, eslint({ fix: true })))
        .pipe(gif(options.lint, eslint.format()))
		.pipe(gif(options.maps, maps.write('./')))
		.pipe(gulp.dest(options.dist + "/scripts"))
		.pipe(connect.reload())//To reload the browser
});

//The styles task generate css with all the sass files, and create maps files if the option is set to true
gulp.task('styles', function() {
	return gulp.src(options.src + "/sass/global.scss")
		.pipe(gif(options.maps, maps.init()))
		.pipe(sass())
		.pipe(gif(options.maps, maps.write('./')))
		.pipe(gulp.dest(options.dist + "/styles"))
		.pipe(connect.reload())//To reload the browser
});

//The images function will optimize all images
gulp.task('images', function() {
	return gulp.src('./'+options.src + '/images/*')
		.pipe(imageop())
        .pipe(gulp.dest(options.dist + '/content'));
});

//This task will delete all files in the dist folder
gulp.task('clean', function() {
	del([options.dist]+'/*')
});

//this task will execute all the tasks to build the dist folder
gulp.task('html', ['scripts','styles', 'images'], function() {
	return gulp.src(options.src + '/*.html')
		.pipe(gulp.dest(options.dist))
});

//this task will clean "dist" folder, then execute "html"
gulp.task('build', ['clean', 'html']);

//This task will serve the project on a local web server, with livereload
gulp.task('serve', ['build'], function() {
	connect.server({
		root: options.dist,
		port: options.port,
		livereload: true
	});
});

//The watch task watch changes, then execute tasks needed. 
gulp.task('watch', ['serve'], function() {
  gulp.watch(options.src + '/js/**/*.js', ['scripts']);
  gulp.watch(options.src + '/sass/**/*.{scss,sass}', ['styles']);
})

//This is the default task, to let the user type : "gulp", instead of "gulp build"
gulp.task('default', [ 'build' ]);
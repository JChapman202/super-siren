var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');
require('babel/register');

gulp.task('clean', function() {
	return gulp.src(['dist'], {read: false})
		.pipe(clean());
});

gulp.task('build', ['clean'], function() {
	return gulp.src(['index.js', 'lib/**/*.js'], {base: './'})
		.pipe(sourcemaps.init())
		.pipe(babel({optional: ['runtime']}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'));
});

gulp.task('lint', function() {
	return gulp.src(['index.js', 'lib/**/*.js', 'test/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('test', function() {
	return gulp.src(['test/**/*.js'], {read: false})
		.pipe(mocha({
			compilers: {
				js: babel
			},
			reporter: 'spec'
		}));
});

gulp.task('watch', function() {
	gulp.watch(['index.js', 'lib/**/*.js', 'test/**/*.js'], ['lint', 'test', 'build']);
});

gulp.task('default', ['watch', 'lint', 'test', 'build']);

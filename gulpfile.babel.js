'use strict';

import gulp from 'gulp';
import eslint from 'gulp-eslint';
import mocha from 'gulp-mocha';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import clean from 'gulp-clean';
import esdoc from 'gulp-esdoc';
import ghPages from 'gulp-gh-pages';

import 'babel-register';

gulp.task('clean', () =>
	gulp.src(['dist'], {read: false})
		.pipe(clean())
);

gulp.task('build', ['clean'], () =>
	gulp.src(['index.js', 'lib/**/*.js'], {base: './'})
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist'))
);

gulp.task('lint', () =>
	gulp.src(['index.js', 'lib/**/*.js', 'test/**/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError())
);

gulp.task('test', () =>
	gulp.src(['test/**/*.js'], {read: false})
		.pipe(mocha({
			reporter: 'spec',
			compilers: {
				js: babel
			}
		}))
);

gulp.task('docs', () =>
	gulp.src(['./lib'])
		.pipe(esdoc({destination: './docs'}))
);

gulp.task('ghpage-docs', ['docs'], () =>
	gulp.src('./docs/**/*')
		.pipe(ghPages({cacheDir: '../super-siren-docs', push: false}))
);

gulp.task('watch', () =>
	gulp.watch(['index.js', 'lib/**/*.js', 'test/**/*.js'], ['lint', 'test', 'build'])
);

gulp.task('default', ['watch', 'lint', 'test', 'build']);

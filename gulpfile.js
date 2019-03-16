/**
 * Settings
 * Turn on/off build features
 */

var settings = {
	clean: true,
	scripts: true,
	polyfills: false,
	styles: true,
	svgs: true,
	copy: true,
	reload: true
};


/**
 * Paths to project folders
 */

var paths = {
	input: 'src/',
	output: 'dist/',
	scripts: {
		input: 'src/js/*',
		output: 'dist/js/',
		entry: ['src/js/main.js', 'src/js/animation.js']
	},
	styles: {
		input: 'src/sass/**/*.{scss,sass}',
		output: 'dist/css/'
	},
	svgs: {
		input: 'src/svg/*.svg',
		output: 'dist/svg/'
	},
	copy: {
		input: 'src/copy/**/*',
		output: 'dist/'
	},
	reload: './dist/'
};


/**
 * Template for banner to add to file headers
 */

var banner = {
	full:
		'/*!\n' +
		' * <%= package.name %> v<%= package.version %>\n' +
		' * <%= package.description %>\n' +
		' * (c) ' + new Date().getFullYear() + ' <%= package.author.name %>\n' +
		' * <%= package.license %> License\n' +
		' * <%= package.repository.url %>\n' +
		' */\n\n',
	min:
		'/*!' +
		' <%= package.name %> v<%= package.version %>' +
		' | (c) ' + new Date().getFullYear() + ' <%= package.author.name %>' +
		' | <%= package.license %> License' +
		' | <%= package.repository.url %>' +
		' */\n'
};


/**
 * Gulp Packages
 */

// General
var { gulp, src, dest, watch, series, parallel } = require('gulp');
var del = require('del');
var rename = require('gulp-rename');
var header = require('gulp-header');
var package = require('./package.json');
var source = require('vinyl-source-stream');
var merge = require('merge-stream');
var concat = require('gulp-concat');

// Scripts
var jshint = require('gulp-jshint');
var browserify = require('browserify');

// Styles
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minify = require('gulp-cssnano');

// SVGs
var svgmin = require('gulp-svgmin');

// BrowserSync
var browserSync = require('browser-sync');


/**
 * Gulp Tasks
 */

// Remove pre-existing content from output folders
var cleanDist = function (done) {

	// Make sure this feature is activated before running
	if (!settings.clean) return done();

	// Clean the dist folder
	del.sync([
		paths.output
	]);

	// Signal completion
	return done();

};

var bundlejs = function (done) {

	// Make sure this feature is activated before running
	if (!settings.scripts) return done();

	browserify(paths.scripts.entry)
		.transform("babelify", { presets: ["@babel/preset-env"] })
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(header(banner.full, { package: package }))
		.pipe(dest(paths.scripts.output));

	return done();
}

// Lint scripts
var lintScripts = function (done) {

	// Make sure this feature is activated before running
	if (!settings.scripts) return done();

	// Lint scripts
	src(paths.scripts.input)
		.pipe(jshint({ esversion: 6 }))
		.pipe(jshint.reporter('jshint-stylish'));

	// Signal completion
	done();

};

// Process, lint, and minify Sass files
var buildStyles = function (done) {

	// Make sure this feature is activated before running
	if (!settings.styles) return done();

	const normalize = src('node_modules/normalize.css/normalize.css')
	const styles = src(paths.styles.input)
		.pipe(sass({
			outputStyle: 'expanded',
			sourceComments: true
		}))
		.pipe(prefix({
			browsers: ['last 2 version', '> 0.25%'],
			cascade: true,
			remove: true
		}))
		.pipe(header(banner.full, { package: package }))
	merge(normalize, styles)
		.pipe(concat('app.css'))
		.pipe(dest(paths.styles.output))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minify({
			discardComments: {
				removeAll: true
			}
		}))
		.pipe(header(banner.min, { package: package }))
		.pipe(dest(paths.styles.output));
	// Signal completion
	done();

};

// Optimize SVG files
var buildSVGs = function (done) {

	// Make sure this feature is activated before running
	if (!settings.svgs) return done();

	// Optimize SVG files
	src(paths.svgs.input)
		.pipe(svgmin())
		.pipe(dest(paths.svgs.output));

	// Signal completion
	done();

};

// Copy static files into output folder
var copyFiles = function (done) {

	// Make sure this feature is activated before running
	if (!settings.copy) return done();

	// Copy static files
	src(paths.copy.input)
		.pipe(dest(paths.copy.output));

	// Signal completion
	done();

};

// Watch for changes to the src directory
var startServer = function (done) {

	// Make sure this feature is activated before running
	if (!settings.reload) return done();

	// Initialize BrowserSync
	browserSync.init({
		server: {
			baseDir: paths.reload,
		}
	});

	// Signal completion
	done();

};

// Reload the browser when files change
var reloadBrowser = function (done) {
	if (!settings.reload) return done();
	browserSync.reload();
	done();
};

// Watch for changes
var watchSource = function (done) {
	watch(paths.input, series(exports.default, reloadBrowser));
	done();
};


/**
 * Export Tasks
 */

// Default task
// gulp
exports.default = series(
	cleanDist,
	parallel(
		bundlejs,
		lintScripts,
		buildStyles,
		buildSVGs,
		copyFiles
	)
);

// Watch and reload
// gulp watch
exports.watch = series(
	exports.default,
	startServer,
	watchSource
);

// clean
exports.clean = series(
	cleanDist
)
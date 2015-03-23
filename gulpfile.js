var gulp                = require('gulp'),
	install             = require('gulp-install'),
	plugins             = require('gulp-load-plugins')(),
	mainBowerFiles      = require('main-bower-files'),
	del                 = require('del'),
	nib                 = require('nib'),
	historyApiFallback  = require('connect-history-api-fallback');



// DIRECTORIES PATHS -----------------------------------------------------------------

var production, rootDir, tmpDir;
process.env['__IS_PROD__'] = production = plugins.util.env.prod || plugins.util.env.production;
nonotify = plugins.util.env.nonotify;
process.env['__PROJECT_PATH__'] = "build";
rootDir = process.env['__PROJECT_PATH__'] + "/";
tmpDir = ".tmp/";


function notifyFile(path) {
	var _path = path;

	return function(file) {
		return _path + " generated: " + file.relative;
	}
}


var paths = {
	"jade": {
		"source": {
			dev: ["assets/jade/**/*.jade", "!assets/jade/**/_*.jade"],
			prod: ["assets/jade/**/*.jade", "!assets/jade/**/_*.jade", "!assets/jade/index.jade"]
		},
		"dest": ""
	},
	"stylus": {
		"source": ["assets/styl/**/*.styl", "!assets/styl/**/_*.styl"],
		"dest": "data/css"
	},
	"js": {
		"source": "assets/js/app/**/*.js",
		"dest": "data/js",
		"name": "app.js"
	},
	"jslibs": {
		"source": "assets/js/libs/**/*.js"
	},
	"jsbower": {
		"source": "assets/js/components",
		"dest": {
			"js": "data/js",
			"css": "data/css",
			"fonts": "data/fonts",
			"images": "data/css/images"
		},
		"name": {
			"js": "vendor.min.js",
			"css": "vendor.min.css"
		}
	},
	"images": {
		"source": "assets/img/**/*",
		"dest": "data/img",
		"options": {
			"progressive": true,
			"interlaced": true,
			"svgoPlugins": [{
				"removeViewBox": false
			}]
		}
	},
	"fonts": {
		"source": "assets/fonts/**/*",
		"dest": "data/fonts"
	}
};




// JADE -----------------------------------------------------

gulp.task('jade', function() {
	return gulp.src(production ? paths.jade.source.prod : paths.jade.source.dev)
		.pipe(plugins.plumber({errorHandler: nonotify ? plugins.util.noop() : plugins.notify.onError("Error: <%= error.message %>")}))
		.pipe(plugins.jade({pretty: true}))
		.pipe(plugins.cached('jade-cache'))
		.pipe(gulp.dest(rootDir + paths.jade.dest))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("JADE  ")));
});


// JAVASCRIPT -----------------------------------------------

gulp.task('js', function() {
	return gulp.src(paths.js.source)
		.pipe(plugins.plumber({errorHandler: nonotify ? plugins.util.noop() : plugins.notify.onError("Error: <%= error.message %>")}))
		.pipe(production ? plugins.util.noop() : plugins.sourcemaps.init())
		.pipe(plugins.concat(paths.js.name))
		.pipe(production ? plugins.uglify({mangle: false}) : plugins.util.noop())
		.pipe(production ? plugins.util.noop() : plugins.sourcemaps.write({
			"addComment": true,
			"includeContent": true,
			"sourceRoot": "/sources/js"
		}))
		//.pipe(plugins.preprocess())
		.pipe(gulp.dest((production ? tmpDir : rootDir) + paths.js.dest))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("JS    ")));
});


// STYLUS -----------------------------------------------------

gulp.task('stylus', function() {
	return gulp.src(paths.stylus.source)
		.pipe(plugins.plumber({errorHandler: nonotify ? plugins.util.noop() : plugins.notify.onError("Error: <%= error.message %>")}))
		.pipe(plugins.stylus({
			use: nib(),
			"compress": production ? true : false
		}))
		.pipe(production ? plugins.util.noop() : plugins.sourcemaps.init({loadMaps: true}))
		.pipe(production ? plugins.util.noop() : plugins.sourcemaps.write())
		.pipe(gulp.dest((production ? tmpDir : rootDir) + paths.stylus.dest))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("STYLUS ")));
});


// BOWER ----------------------------------------------------

gulp.task('vendor', function() {
	var js, coffee, css, fonts, images;

	js      = plugins.filter(['**/*.js']);
	coffee  = plugins.filter(['**/*.coffee']);
	css     = plugins.filter(['**/*.css']);
	fonts   = plugins.filter(['**/*.svg', '**/*.eot', '**/*.ttf', '**/*.woff']);
	images  = plugins.filter(['**/*.gif', '**/*.png', '**/*.jpeg', '**/*.jpg']);

	return gulp.src(
		mainBowerFiles({
			paths: {
				"bowerDirectory": paths.jsbower.source,
				"bowerrc": __dirname + "/.bowerrc",
				"bowerJson": __dirname + "/bower.json"
			}
		})
			.concat(paths.jslibs.source)
	)
		.pipe(coffee)
		.pipe(plugins.concat('all.coffee'))
		.pipe(plugins.coffee({bare: true}))
		.pipe(coffee.restore())

		.pipe(js)
		.pipe(production ? plugins.util.noop() : plugins.sourcemaps.init())
		.pipe(plugins.concat(paths.jsbower.name.js))
		.pipe(production ? plugins.uglify({mangle: false}) : plugins.util.noop())
		.pipe(production ? plugins.util.noop() : plugins.sourcemaps.write({
			"addComment": true,
			"includeContent": true,
			"sourceRoot": "/sources/js"
		}))
		.pipe(gulp.dest((production ? tmpDir : rootDir) + paths.jsbower.dest.js))
		.pipe(js.restore())

		.pipe(css)
		.pipe(production ? plugins.util.noop() : plugins.sourcemaps.init())
		.pipe(plugins.concat(paths.jsbower.name.css))
		.pipe(plugins.minifyCss())
		.pipe(production ? plugins.util.noop() : plugins.sourcemaps.write({
			"addComment": true,
			"includeContent": true,
			"sourceRoot": "/sources/css"
		}))
		.pipe(gulp.dest((production ? tmpDir : rootDir) + paths.jsbower.dest.css))
		.pipe(css.restore())

		.pipe(fonts)
		.pipe(gulp.dest(rootDir + paths.jsbower.dest.fonts))
		.pipe(fonts.restore())

		.pipe(images)
		.pipe(gulp.dest(rootDir + paths.jsbower.dest.images))
		.pipe(images.restore())

		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("VENDOR")));
});


// IMAGES ---------------------------------------------------

gulp.task('images', function() {
	return gulp.src(paths.images.source)
		.pipe(plugins.plumber({errorHandler: nonotify ? plugins.util.noop() : plugins.notify.onError("Error: <%= error.message %>")}))
		.pipe(production ? plugins.util.noop() : plugins.changed(rootDir + paths.images.dest))
		.pipe(plugins.imagemin(paths.images.options))
		.pipe(gulp.dest(rootDir + paths.images.dest))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("IMAGES")));
});


// FONTS ----------------------------------------------------

gulp.task('fonts', function() {
	return gulp.src(paths.fonts.source)
		.pipe(production ? plugins.util.noop() : plugins.changed(rootDir + paths.fonts.dest))
		.pipe(gulp.dest(rootDir + paths.fonts.dest))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("FONTS ")));
});


// SERVER ---------------------------------------------------

var EXPRESS_PORT = 5010;
var EXPRESS_ROOT = __dirname + "/" + rootDir;

gulp.task('server', function () {
	plugins.connect.server({
		root: EXPRESS_ROOT,
		port: EXPRESS_PORT,
		livereload: false,
		middleware: function() {
			return [historyApiFallback];
		}
	});
});


// COMPONENTS -----------------------------------------------

gulp.task('bower-install', function() {
	return gulp.src([__dirname + "/bower.json"]).pipe(install());
});

gulp.task('npm-install', function() {
	return gulp.src([__dirname + "/package.json"]).pipe(install());
});


// CLEAN ---------------------------------------------------

gulp.task('clean', function() {
	del(rootDir + "**/*", {force: true}, function(err) {
		if (err) plugins.util.log(err);
	});
});


// REVISION REPLACE ----------------------------------------

gulp.task('revision', function () {
	if (production) {
		var userefAssets = plugins.useref.assets({searchPath: tmpDir});

		return gulp.src("assets/jade/index.jade")
			.pipe(plugins.jade({pretty: true}))
			.pipe(userefAssets)
			.pipe(plugins.rev())
			.pipe(userefAssets.restore())
			.pipe(plugins.useref())
			.pipe(plugins.revReplace())
			.pipe(gulp.dest(rootDir));

	}
});





// INIT TASKS -----------------------------------------------

gulp.task('update-components', ['bower-install', 'npm-install']);

gulp.task('build-assets', ['jade', 'js', 'stylus', 'images', 'fonts'], function() {
	gulp.start('revision');
});

gulp.task('build-vendor', ['vendor'], function () {
	gulp.start('build-assets');
});

gulp.task('build', ['clean', 'update-components'], function() {
	gulp.start('build-vendor');
});

gulp.task('buildwatch', ['build'], function() {
	gulp.start('watch');
});

gulp.task('watch', ['server'], function() {
	gulp.watch(paths.jade.source.dev[0], ['jade']);
	gulp.watch(paths.stylus.source[0], ['stylus']);
	gulp.watch(paths.images.source, ['images']);
	gulp.watch(paths.js.source, ['js']);
	gulp.watch(paths.jsbower.source, ['vendor']);
	gulp.watch(__dirname + '/bower.json', ['bower-install'], function() {
		gulp.start('vendor');
	});
});

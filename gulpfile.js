var childProcess    = require('child_process'),
	spawn           = childProcess.spawn,
	gulp            = require('gulp'),
	install         = require('gulp-install'),
	plugins         = require('gulp-load-plugins')(),
	mainBowerFiles  = require('main-bower-files'),
	del             = require('del');



// DIRECTORIES PATHS -----------------------------------------------------------------

var production, rootDir, tmpDir;
production = plugins.util.env.type === 'production';
nonotify = plugins.util.env.nonotify;
process.env['__TWMS_PROJECT_PATH__'] = "build";
rootDir = process.env['__TWMS_PROJECT_PATH__'] + "/";
tmpDir = ".tmp/";



var paths = {
	"scss": {
		"source": "assets/scss/**/*.scss",
		"watch": "assets/scss/**/*.scss",
		"dest": "data/css"
	},
	"js": {
		"source": "assets/js/app/**/*.js",
		"watch": "assets/js/app/**/*.js",
		"dest": "data/js",
		"name": "app.js"
	},
	"jslibs": {
		"source": "assets/js/libs/**/*.js"
	},
	"jsbower": {
		"source": "assets/js/components",
		"watch": "assets/js/components",
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
	"jade": {
		"source": ["assets/jade/**/*.jade", "!assets/jade/**/_*.jade", "!assets/jade/index.jade"],
		"watch": ["assets/jade/**/*.jade", "!assets/jade/**/index.jade"],
		"dest": ""
	},
	"images": {
		"source": "assets/img/**/*",
		"watch": "assets/img/**/*",
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
	},
	"sounds": {
		"source": "assets/sounds/**/*",
		"dest": "data/sounds"
	}
};


function notifyFile(path) {
	var _path = path;

	return function(file) {
		return _path + " generated: " + file.relative;
	}
}



// JADE -----------------------------------------------------

gulp.task('jade', function() {
	return gulp.src(paths.jade.source)
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
		.pipe(gulp.dest((production ? tmpDir : rootDir) + paths.js.dest))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("JS    ")));
});


// SASS -----------------------------------------------------

gulp.task('sass', function() {
	var sassResult =  gulp.src(paths.scss.source)
		.pipe(plugins.plumber({errorHandler: nonotify ? plugins.util.noop() : plugins.notify.onError("Error: <%= error.message %>")}))
		.pipe(plugins.rubySass({
			"noCache": true,
			"compass": true,
			"style": production ? "compressed" : "compact",
			"sourcemap=none": true
		}))
		//.pipe(production ? plugins.util.noop() : plugins.sourcemaps.init({loadMaps: true}))
		.pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		//.pipe(production ? plugins.util.noop() : plugins.sourcemaps.write())
		.pipe(gulp.dest((production ? tmpDir : rootDir) + paths.scss.dest))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("SASS  ")));

	return sassResult;
});


// BOWER ----------------------------------------------------

gulp.task('vendor', function() {
	var js, css, fonts, images;

	js = plugins.filter(['**/*.js']);
	css = plugins.filter(['**/*.css']);
	fonts = plugins.filter(['**/*.svg', '**/*.eot', '**/*.ttf', '**/*.woff']);
	images = plugins.filter(['**/*.gif', '**/*.png', '**/*.jpeg', '**/*.jpg']);

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

		.pipe(js)
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("VENDOR JS ")))
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
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("VENDOR CSS ")))
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
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("VENDOR FONTS ")))
		.pipe(fonts.restore())

		.pipe(images)
		.pipe(gulp.dest(rootDir + paths.jsbower.dest.images))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("VENDOR IMAGES ")))
		.pipe(images.restore());
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


// SOUNDS ----------------------------------------------------

gulp.task('sounds', function() {
	return gulp.src(paths.sounds.source)
		.pipe(gulp.dest(rootDir + paths.sounds.dest))
		.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("SOUNDS ")));
});


// SERVER ---------------------------------------------------

gulp.task('server', function() {
	spawn('mvn', ['clean'], {
		stdio: 'inherit'
	});
	spawn('mvn', ['tomcat7:run', '-f', '../../../../pom.xml'], {
		stdio: 'inherit'
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

gulp.task('clean', function(cb) {
	return del("build", {force: true}, function(err) {
		if (err) plugins.util.log('CLEAN TASK ERROR: ', err);

		if (cb) cb();
	});
});


// REVISION REPLACE ----------------------------------------

gulp.task('index-jsp', function () {
	if (production) {
		var userefAssets = plugins.useref.assets({searchPath: tmpDir});

		return gulp.src("assets/jade/index.jade")
			.pipe(plugins.jade({pretty: true}))
			.pipe(userefAssets)
			.pipe(plugins.rev())
			.pipe(userefAssets.restore())
			.pipe(plugins.useref())
			.pipe(plugins.revReplace())
			.pipe(plugins.extReplace('.jsp'))
			.pipe(gulp.dest(rootDir));

	} else {
		return gulp.src("assets/jade/index.jade")
			.pipe(plugins.jade({pretty: true}))
			.pipe(plugins.extReplace('.jsp'))
			.pipe(gulp.dest(rootDir + paths.jade.dest))
			.pipe(nonotify ? plugins.util.noop() : plugins.notify(notifyFile("JADE  ")));
	}
});





// INIT TASKS -----------------------------------------------

gulp.task('update-components', ['bower-install', 'npm-install']);

gulp.task('build-vendor', ['update-components'], function () {
	gulp.start('vendor');
});

gulp.task('build-assets', ['jade', 'js', 'sass', 'images', 'fonts', 'sounds'], function() {
	del(['/tmp/gulp-ruby-sass'], {force: true}, function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log('GULP-RUBY-SASS DELETED !!!');
		}
	});
});

gulp.task('build-index', ['build-vendor', 'build-assets'], function() {
	gulp.start('index-jsp');
});

gulp.task('build', function() {
	del([rootDir + "**/*", "!" + rootDir +"WEB-INF/**"], {force: true}, function() {
		gulp.start('build-index');
	});
});

gulp.task('buildwatch', ['build'], function() {
	gulp.start('watch');
});


gulp.task('banana', ['build'], function() {
	gulp.start('watch');
	gulp.start('server');
});


gulp.task('watch', function() {
	gulp.watch(paths.jade.watch, ['jade']);
	gulp.watch(["assets/jade/index.jade", "assets/jade/templates/*.jade"], ['index-jsp']);
	gulp.watch(paths.images.watch, ['images']);
	gulp.watch(paths.scss.watch, ['sass']);
	gulp.watch(paths.js.watch, ['js']);
	gulp.watch(paths.jsbower.watch, ['vendor']);
	gulp.watch(__dirname + '/bower.json', ['bower-install'], function() {
		gulp.start('vendor');
	});
});


import gulp from 'gulp'
import fs from 'fs'
import browserSync from 'browser-sync'
import gcmq from 'gulp-group-css-media-queries'
import del from 'del'
import gulpLoadPlugins from 'gulp-load-plugins'
import path from 'path'

let plugin = gulpLoadPlugins(),
	sync = browserSync.create();


// Доступные плагины через Babel
// gulp.task('show', console.log('\n', Object.keys(plugin).join('\n')));

function onerror(e) {
	console.log('>>> error:\n', e.name);
	console.log('---> message <---\n', e.message);
	console.log('---> reason <---\n', e.reason);
	// emit here
	this.emit('end');
}


// BROWSERSYNC
gulp.task('browsersync', () => {
	sync.init({
		// tunnel: 'sync', // Для мобильного
		server: {
			baseDir: "dist"
		},
		open: false,
		notify: false
	});
});

/////////////////////////////////////////////////
// HTML /////////////////////////////////////////
/////////////////////////////////////////////////

//PUG
gulp.task('pug', () => {
	let mask = 'src/pages/*.pug';

	function run() {
		return gulp
			.src(mask)
			.pipe(plugin.plumber())
			.pipe(plugin.pug({
				pretty: true
			}))
			.on('error', onerror)
			.pipe(gulp.dest('dist'))
			.pipe(sync.reload({stream: true}));
	}

	let path = [
		'src/pages/*.pug',
		'src/blocks/**/*.pug',
		'src/common/pug/**/*.pug'
	];

	plugin.watch(path, run);
	return run();
});

/////////////////////////////////////////////////
// CSS //////////////////////////////////////////
/////////////////////////////////////////////////

// SCSS
gulp.task('sass', () => {
	let mask = 'src/common/scss/style.scss';
	function syncReload() {
		sync.reload();
	}
	function run() {
		gulp.src(mask)
		.pipe(plugin.plumber())
		.pipe(plugin.sass({
			outputStyle: 'expanded'
		}))
		.on('error', onerror)
		.pipe(plugin.autoprefixer({
			browsers: ['last 2 versions'],
			cascade: true
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe(gcmq())
		.pipe(sync.stream());
		syncReload();
	}

	let path = [
		'src/blocks/**/*.scss',
		'src/common/scss/**/*.scss'
	];

	plugin.watch(path, run);
	return run();
});


/////////////////////////////////////////////////
// JS ///////////////////////////////////////////
/////////////////////////////////////////////////

// СБОРКА JS БЛОКОВ
gulp.task('js:main', () => {
	let mask = [
			'src/blocks/**/*.js',
			'src/common/js/**/*.js',
			'!src/common/js/all/**'
		],
		readyPrev = ';\n$(document).ready(function() {\n',
		readyPost = '\n});';

	function run() {
		return gulp.src(mask)
			.pipe(plugin.concat('main.js'))
			.pipe(plugin.insert.wrap(readyPrev, readyPost))
			.pipe(gulp.dest('src/common/js/all'));
	}

	plugin.watch(mask, run);
	return run();
});

// СБОРКА JS БИБЛИОТЕК
gulp.task('js:lib', () => {
	let mask = 'src/common/libs/on/**/*.js';

	function run() {
		fs.writeFileSync("src/common/js/all/libs.js", '');
		return gulp.src(mask)
			.pipe(plugin.concat('libs.js'))
			.pipe(gulp.dest('src/common/js/all'));
	}

	plugin.watch(mask, run);
	return run();
});

gulp.task('js:allconcat', () => {
	let mask = [
		'src/common/js/all/jquery.min.js',
		'src/common/js/all/libs.js',
		'src/common/js/all/main.js'
	];

	function run() {
		return gulp.src(mask)
			.pipe(plugin.concat('main.js'))
			.pipe(gulp.dest('dist/js'))
			.pipe(sync.reload({stream: true}));
	}

	plugin.watch(mask, run);
	return run();
});

gulp.task('js', ['js:lib', 'js:main', 'js:allconcat']);

/////////////////////////////////////////////////
// IMG //////////////////////////////////////////
/////////////////////////////////////////////////

// СБОРКА СПРАЙТА PNG
gulp.task('sprite:png', function() {
	let mask = 'src/common/sprite/png-sprite/*.png';

	function run() {
		let spriteData =
			gulp.src(mask)
				.pipe(plugin.spritesmith({
					imgName: 'sprite.png',
					cssName: '_png-sprite.scss',
					padding: 15,
					cssFormat: 'scss',
					cssTemplate: 'src/common/scss/config/png.template.mustache',
					algorithm: 'binary-tree',
					cssVarMap: function(sprite) {
						sprite.name = 's-' + sprite.name;
					}
				}));

		spriteData.img.pipe(gulp.dest('dist/sprite')); // путь, куда сохраняем картинку
		spriteData.css.pipe(gulp.dest('src/common/scss')); // путь, куда сохраняем стили
	}

	plugin.watch(mask, run);
	return run();
});

// СБОРКА СПРАЙТА SVG
gulp.task('sprite:svg', function () {
	let mask = 'src/common/sprite/svg-sprite/**/*.svg';

	function run() {
		return gulp.src(mask)
		// minify svg
			.pipe(plugin.svgmin({
				js2svg: {
					pretty: true
				}
			}))
			// remove all fill, style and stroke declarations in out shapes
			.pipe(plugin.cheerio({
				run: function ($) {
					$('[fill]').removeAttr('fill');
					$('[stroke]').removeAttr('stroke');
					$('[style]').removeAttr('style');
				},
				parserOptions: {xmlMode: true}
			}))
			// cheerio plugin create unnecessary string '&gt;', so replace it.
			.pipe(plugin.replace('&gt;', '>'))
			// build svg sprite
			.pipe(plugin.svgSprite({
				shape               : {
					id              : {
						generator   : function(name) {
							return path.basename(name, '.svg')
						}
					}
				},
				mode: {
					symbol: {
						sprite: "../sprite.svg",
						render: {
							scss: {
								dest: '../../../src/common/scss/_svg-sprite.scss',
								template: 'src/common/scss/config/svg.template.mustache'
							}
						}
					}
				}
			}))
			.pipe(gulp.dest('dist/sprite'));
	}

	plugin.watch(mask, run);
	return run();

});

// СБОРКА СПРАВТОВ
gulp.task('sprite', ['sprite:png', 'sprite:svg']);


// ПЕРЕМЕЩЕНИЕ ИЗОБРАЖЕНИЙ
gulp.task('img', () => {
	let mask = [
		'src/common/img/**/*.{png,jpg,jpeg,gif,svg}',
		'src/common/libs/on/**/*.{png,jpg,jpeg,gif}'
	];
	function run() {
		del.sync('dist/img');
		return gulp.src(mask)
			.pipe(plugin.rename({dirname: ''}))
			.pipe(gulp.dest('dist/img'));
	}

	plugin.watch(mask, run);
	run();
});

/////////////////////////////////////////////////
// FONTS ////////////////////////////////////////
/////////////////////////////////////////////////

// ПЕРЕМЕЩЕНИЕ ШРИФТОВ
gulp.task('fonts', () => {
	let pathFonts = 'src/common/fonts/**',
		pathFontsLib = 'src/common/libs/on/**/*.{eot,svg,ttf,woff}';

	function moveFonts() {
		del.sync('dist/fonts');
		gulp.src(pathFonts)
			.pipe(gulp.dest('dist/fonts'));
	}

	function moveFontsLibs() {
		gulp.src(pathFontsLib)
			.pipe(plugin.rename({dirname: ''}))
			.pipe(gulp.dest('dist/fonts'));
	}

	plugin.watch(pathFonts, moveFonts);
	plugin.watch(pathFontsLib, moveFontsLibs);

	moveFonts();
	moveFontsLibs();
});


/////////////////////////////////////////////////
// BUILD ////////////////////////////////////////
/////////////////////////////////////////////////

// СБОРКА ПРОЕКТА
gulp.task('move', () => {
	gulp.src('dist/*.html')
		.pipe(plugin.htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('product'));
	gulp.src('dist/js/*.js')
		.pipe(plugin.uglify())
		.pipe(gulp.dest('product/js'));
	gulp.src('dist/sprite/*.{png,svg}')
		.pipe(gulp.dest('product/sprite'));
	gulp.src('dist/fonts/**/*')
		.pipe(gulp.dest('product/fonts'));
	gulp.src('dist/css/style.css')
		.pipe(plugin.cssnano())
		.pipe(gulp.dest('product/css'));
	gulp.src('dist/fonts/**')
		.pipe(gulp.dest('product/fonts'));
	gulp.src('src/.htaccess')
		.pipe(gulp.dest('product'))
});

// ОПТИМИЗАЦИЯ ИЗОБРАЖЕНИЙ
gulp.task('imgmin', () => {
	return gulp.src('dist/img/**/*')
		.pipe(plugin.imagemin())
		.pipe(gulp.dest('product/img'));
});

// ОЧИСТКА ПАПКИ СБОРКИ
gulp.task('clean', () => {
	return del.sync('product');
});

gulp.task('build', ['clean', 'imgmin', 'move']);

// ДЕФОЛТНЫЙ ТАСК
gulp.task('default', ['pug', 'sass', 'js', 'sprite', 'img', 'fonts', 'browsersync']);
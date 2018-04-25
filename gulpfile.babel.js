import gulp from 'gulp'
import fs from 'fs'
import browserSync from 'browser-sync'
import gcmq from 'gulp-group-css-media-queries'
import smartgrid from 'smart-grid'
import del from 'del'
import gulpLoadPlugins from 'gulp-load-plugins'
import path from 'path'

let plugin = gulpLoadPlugins(),
	sync = browserSync.create();

// gulp.task('show', console.log('\n', Object.keys(plugin).join('\n')));

// SMARTGRID
let settings = {
	filename: "smart-grid",
	outputStyle: 'scss', /* less || scss || sass || styl */
	columns: 24, /* number of grid columns */
	offset: '10px', /* gutter width px || % */
	mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
	container: {
		maxWidth: '950px', /* max-width оn very large screen */
		fields: '0px' /* side fields */
	},
	breakPoints: {
		lg: {
			width: '950px' /* -> @media (max-width: 1100px) */
		},
		md: {
			width: '768px'
		},
		sm: {
			width: '480px',
			fields: '15px' /* set fields only if you want to change container.fields */
		},
		xs: {
			width: '320px'
		}
		/*
		 We can create any quantity of break points.

		 some_name: {
		 width: 'Npx',
		 fields: 'N(px|%|rem)',
		 offset: 'N(px|%|rem)'
		 }
		 */
	}
};

gulp.task('smartgrid', () => {
	smartgrid('src/common/scss/mixins', settings)
});

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
		server: {
			baseDir: "dist"
		},
		port: 3000,
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
gulp.task('sass:style', () => {
	let mask = 'src/common/scss/style.scss';

	function run() {
		return gulp.src(mask)
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
		.pipe(sync.reload({stream: true}));
	}

	let path = [
		'src/blocks/**/*.scss',
		'src/common/scss/**/*.scss'
	];

	plugin.watch(path, run);
	return run();
});

// СОЗДАТЬ @IMPORT SCSS/SASS ИЗ ПАПКИ LIBS
gulp.task('sass:lib', () => {
	let mask = 'src/common/scss/config/import-libs.scss';

	function run() {
		return gulp.src(mask)
		.pipe(plugin.sassGlob())
		.pipe(plugin.rename('_libs.scss'))
		.pipe(gulp.dest('src/common/scss'))
		.pipe(sync.reload({stream: true}));
	}

	return run();
});

gulp.task('sass', ['sass:lib', 'sass:style']);



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
	let mask = [
				'src/common/img/png-sprite/*.png',
				'src/blocks/**/*.png'
	];

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
	let mask = ['src/common/img/_svg-sprite/**/*.svg',
				'src/blocks/**/*.svg'
	];

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
		'src/common/img/content/**/*.{png,jpg,jpeg,gif}',
		'src/common/img/general/**/*.{png,jpg,jpeg,gif}',
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
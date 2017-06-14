var gulp = require('gulp'),
    pug = require('gulp-pug'),
    browsersync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    sass = require('gulp-sass'),
    cache = require('gulp-cache'),
    spritesmith = require("gulp.spritesmith"),
    plumber = require("gulp-plumber"),
    notify = require("gulp-notify"),
    newer = require("gulp-newer"),
    autoprefixer = require('gulp-autoprefixer'),
	svgSprite = require('gulp-svg-sprite'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace');

// Работа со sass(scss)
gulp.task('sass', function () {
    return gulp.src([
        'dev/static/scss/main.scss',
    ])
    .pipe(plumber())
    .pipe(sass({
        'include css': true
    })
    .on("error", notify.onError(function(error) {
        return "Message to the notifier: " + error.message;
    })))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'], {cascade: true}))
    .pipe(gulp.dest('dev/static/css'))
    .pipe(browsersync.reload({
        stream: true
    }));
});

// Работа с Pug
gulp.task('pug', function() {
    return gulp.src('dev/pug/pages/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .on("error", notify.onError(function(error) {
            return "Message to the notifier: " + error.message;
        }))
        .pipe(gulp.dest('dev'));
});

// Browsersync
gulp.task('browsersync', function() {
    browsersync({
        server: {
            baseDir: 'dev'
        },
    });
});

// Работа с JS
gulp.task('scripts', ['libsclear'], function() {
    return gulp.src([
            // Библиотеки
			'dev/static/libs/svg4everybody/svg4everybody.min.js',
			'dev/static/libs/svg4everybody/svg4everybody.legacy.min.js',
			'dev/static/libs/bootstrap/bootstrap.min.js',
//			'dev/static/libs/magnific/jquery.magnific-popup.min.js',
//			'dev/static/libs/bxslider/jquery.bxslider.min.js',
//			'dev/static/libs/maskedinput/maskedinput.js',
//			'dev/static/libs/slick/slick.min.js',
//			'dev/static/libs/validate/jquery.validate.min.js',

        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dev/static/js'))
        .pipe(browsersync.reload({
            stream: true
        }));
});

gulp.task('libsclear', function() {
	return del.sync('dev/static/js/libs.min.js');
});


// Сборка спрайтов PNG
gulp.task('cleansprite', function() {
    return del.sync('dev/static/img/sprite/sprite.png');
});

gulp.task('spritemade', function() {
    var spriteData =
        gulp.src('dev/static/img/sprite/*.*')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: '_sprite.scss',
            padding: 15,
            cssFormat: 'scss',
            cssTemplate: 'scss.template.mustache',
            algorithm: 'binary-tree',
            cssVarMap: function(sprite) {
                sprite.name = 's-' + sprite.name;
            }
        }));

    spriteData.img.pipe(gulp.dest('dev/static/img/sprite/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('dev/static/scss/')); // путь, куда сохраняем стили
});

gulp.task('sprite', ['cleansprite', 'spritemade', 'cleansvgsprite', 'svgSpriteBuild']);

// Сборка спрайтов SVG
gulp.task('cleansvgsprite', function() {
    return del.sync('dev/static/img/svg/sprite.svg');
});

gulp.task('svgSpriteBuild', function () {
	return gulp.src('dev/static/img/svg/*.svg')
	// minify svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill, style and stroke declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		// cheerio plugin create unnecessary string '&gt;', so replace it.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "../sprite.svg",
					render: {
						scss: {
							dest:'../../../scss/_svg-sprite.scss',
							template: "sprite_template.scss"
						}
					}
				}
			}
		}))
		.pipe(gulp.dest('dev/static/img/svg/'));
});

// Слежение
gulp.task('watch', ['browsersync', 'sass', 'scripts'], function() {
    gulp.watch('dev/static/scss/**/*.scss', ['sass']);
    gulp.watch('dev/pug/**/*.pug', ['pug']);
    gulp.watch('dev/*.html', browsersync.reload);
    gulp.watch(['dev/static/js/*.js', '!dev/static/js/libs.min.js', '!dev/static/js/jquery.js'], ['scripts']);
});


// Очистка папки сборки
gulp.task('clean', function() {
    return del.sync('product');
});

// Оптимизация изображений
gulp.task('img', function() {
    return gulp.src(['dev/static/img/**/*', '!dev/static/img/sprite/*'])
        .pipe(cache(imagemin({
            progressive: true,
            use: [pngquant()]

        })))
        .pipe(gulp.dest('product/static/img'));
});

// Сборка проекта

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {
    var buildCss = gulp.src('dev/static/css/*.css')
		.pipe(cssnano())
        .pipe(gulp.dest('product/static/css'));

    var buildFonts = gulp.src('dev/static/fonts/**/*')
        .pipe(gulp.dest('product/static/fonts'));

	var mainJsNano = gulp.src('dev/static/js/main.js')
		.pipe(uglify())
		.pipe(gulp.dest('product/static/js'));
    var buildJs = gulp.src(['dev/static/js/**.js', '!dev/static/js/main.js'])
        .pipe(gulp.dest('product/static/js'));

    var buildHtml = gulp.src('dev/*.html')
        .pipe(gulp.dest('product/'));

    var buildImg = gulp.src('dev/static/img/sprite/sprite.png')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('product/static/img/sprite/'));
});

// Очистка кеша
gulp.task('clear', function() {
    return cache.clearAll();
});

// Дефолтный таск
gulp.task('default', ['watch']);
import gulp from "gulp";
import del from "del";
import ws from "gulp-webserver";
import fileinclude from "gulp-file-include";
// import image from "gulp-imagemin";
var sass = require('gulp-sass')(require('sass'));//sass-css
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import miniCSS from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";
import ghPages from "gulp-gh-pages";
// sass.compiler = require("node-sass");

const routes = {
  html: {
    watch: "src/**/*.html",
    src: "src/**/*.html",
    dest: "app",
  },
  img: {
    src: "src/images/**/*.{jpg, jpeg, png, gif}",
    dest: "app/assets/images",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/style.scss",
    dest: "app/assets/css",
  },
  css: {
    watch: "src/scss/css/*.css",
    src: "src/scss/css/*.css",
    dest: "app/assets/css/css",
  },
  font: {
    watch: "src/fonts/**/*.{ttf,woff,eof,svg}",
    src: "src/fonts/**/*.{ttf,woff,eof,svg}",
    dest: "app/assets/fonts",
  },
  js: {
    watch: "src/js/*.js",
    src: "src/js/*.js",
    dest: "app/assets/js",
  },
  jslib: {
    watch: "src/js/lib/*.js",
    src: "src/js/lib/*.js",
    dest: "app/assets/js/lib",
  },
};

const html = () =>
gulp
.src(routes.html.src)
.pipe(fileinclude({
  prefix: '@@@',
  basepath: '@file'
}))
.pipe(gulp.dest(routes.html.dest));

const clean = () => del(["app/", ".publish"]);

const webserver = () =>
gulp
.src("app")
.pipe(ws({
  // host: '192.168.0.18',
  livereload: true,
  open: true,
  port: 8081,
 }));

// const img = () =>
// gulp
// .src(routes.img.src)
// .pipe(image())
// .pipe(gulp.dest(routes.img.dest));

const font = () =>
gulp
.src(routes.font.src)
.pipe(gulp.dest(routes.font.dest));

const css = () =>
gulp
.src(routes.css.src)
.pipe(gulp.dest(routes.css.dest));

const scss = () =>
gulp
.src(routes.scss.src)
.pipe(sass().on("error", sass.logError))
// Browserslist 경고 메세지 때문에 하단부분 지우고 .browserslistrc 파일 생성해서 설정값 저장
// .pipe(autoprefixer({
//     browsers: ["last 2 versions"]
//   })
// )
.pipe(postcss([autoprefixer]))
.pipe(miniCSS())
.pipe(gulp.dest(routes.scss.dest));

const js = () =>
gulp
.src(routes.js.src)
// .pipe(
//   bro({
//     transform: [
//       babelify.configure({ presets: ["@babel/preset-env"] }),
//       ["uglifyify", { global: true }]
//     ]
//   })
// )
.pipe(gulp.dest(routes.js.dest));

const jslib = () =>
gulp
.src(routes.jslib.src)
.pipe(gulp.dest(routes.jslib.dest));

const gh = () => gulp.src("app/**/*").pipe(ghPages());

const watch = () => {
  gulp.watch(routes.html.watch, html);
  // gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, scss);
  gulp.watch(routes.css.watch, css);
  gulp.watch(routes.font.watch, font);
  gulp.watch(routes.css.watch, font);
  gulp.watch(routes.js.watch, js);
  gulp.watch(routes.jslib.watch, js);
};

const prepare = gulp.series([font, css, jslib]);

const assets = gulp.series([html, scss, css, js, jslib]);

const live = gulp.parallel([webserver, watch]);

export const app = gulp.series([prepare, assets]);
export const build = gulp.series([app,live]);
export const deploy = gulp.series([app, gh, clean]);
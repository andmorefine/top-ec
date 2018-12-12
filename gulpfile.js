// gulpプラグインの読み込み
const gulp = require("gulp");
// Sassをコンパイルするプラグインの読み込み
const sass = require("gulp-sass");
// add vender prifix
var autoprefixer = require('gulp-autoprefixer');

// error handling
var plumber = require('gulp-plumber');

var nunjucksRender = require("gulp-nunjucks-render");

var browserSync = require("browser-sync").create();

// style.scssの監視タスクを作成する
gulp.task("default", function() {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });

  // ★ style.scssファイルを監視
  gulp.watch("./scss/**/*.scss", function() {
    // style.scssファイルを取得
    gulp
      .src(["./scss/**/*.scss"])
      .pipe(plumber())
      // Sassのコンパイルを実行
      .pipe(
        // CSS output style (nested | expanded | compact | compressed)
        sass({
          outputStyle: "compressed"
        })
          .on("error", sass.logError)
      )
      .pipe(autoprefixer({
        browsers: ['last 2 version', 'ie >= 9', 'iOS >= 8.1', 'Android >= 4.4'],
        cascade: false
      }))
      .pipe(gulp.dest("dist"))
      .pipe(browserSync.stream());
  });

  gulp.watch("./page/**/*.html", function() {
    gulp
      .src(["./page/**/*.html", "!./page/**/_*.html"])
      .pipe(
        nunjucksRender({
          path: ["./page"],
          data: {
            image_path: './img'
          }
        })
      )
      .pipe(gulp.dest("dist"))
      .pipe(browserSync.stream());
  });
});

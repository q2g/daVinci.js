var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var rename = require('gulp-rename');
var mod = require("gulp-json-modify");
var replace = require('gulp-string-replace');
var del = require('del');

var package = require("./package.json");

var gitVersion  = require("./gulpGitPlugin");

gulp.task('less-umd', function () {
  return gulp.src('./src/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    // .pipe(rename({dirname: ''}))
    .pipe(gulp.dest('./dist/umd'));
});

gulp.task('less-esm', function () {
    return gulp.src('./src/**/*.less')
    .pipe(less({
    paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    // .pipe(rename({dirname: ''}))
    .pipe(gulp.dest('./dist/esm'));
});

gulp.task('html-umd', function () {
  return gulp.src('./src/**/*.html')
    // .pipe(rename({dirname: ''}))
    .pipe(gulp.dest('./dist/umd'));
})

gulp.task('html-esm', function () {
    return gulp.src('./src/**/*.html')
    // .pipe(rename({dirname: ''}))
    .pipe(gulp.dest('./dist/esm'));
})

gulp.task("gitversionPackage", () => {  
    gitVersion.getVersionNumber()
    .then((versionnumber) => {
        return gulp.src("./package.json")
        .pipe(mod({
            key: "version",
            value: versionnumber
        }))
        .pipe(gulp.dest("./"));
    })
    .catch((error) => {
        console.error("Error in gitversionPackage gulp task", error);
    });
});
  
gulp.task("addVersionNumber-umd", () => {
    gitVersion.getFullVersionString()
    .then((res) => {
            return gulp.src('./dist/umd/daVinci.js')
            .pipe(replace(/\|GitVersionNumber\|/, res))
            .pipe(gulp.dest('./dist/umd'));
    })
    .catch((error) => {
        console.log("Error in addVersionNumber gulp task", error);
    });
});

gulp.task("addVersionNumber-esm", () => {
    gitVersion.getFullVersionString()
    .then((res) => {
            return gulp.src('./dist/esm/daVinci.js')
            .pipe(replace(/\|GitVersionNumber\|/, res))
            .pipe(gulp.dest('./dist/esm'));
    })
    .catch((error) => {
        console.log("Error in addVersionNumber gulp task", error);
    });
});

gulp.task('copy-typings', function () {
    gulp.src('./dist/umd/daVinci.d.ts')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function () {
    return del('./dist/umd/daVinci.d.ts');
});
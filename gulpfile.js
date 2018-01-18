var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var rename = require('gulp-rename');
let mod = require("gulp-json-modify");
var replace = require('gulp-string-replace');

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

gulp.task('less-amd', function () {
    return gulp.src('./src/**/*.less')
    .pipe(less({
    paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    // .pipe(rename({dirname: ''}))
    .pipe(gulp.dest('./dist/amd'));
});

gulp.task('html-umd', function () {
  return gulp.src('./src/**/*.html')
    // .pipe(rename({dirname: ''}))
    .pipe(gulp.dest('./dist/umd'));
})

gulp.task('html-amd', function () {
    return gulp.src('./src/**/*.html')
    // .pipe(rename({dirname: ''}))
    .pipe(gulp.dest('./dist/amd'));
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

gulp.task("addVersionNumber-amd", () => {
    gitVersion.getFullVersionString()
    .then((res) => {
            return gulp.src('./dist/amd/daVinci.js')
            .pipe(replace(/\|GitVersionNumber\|/, res))
            .pipe(gulp.dest('./dist/amd'));
    })
    .catch((error) => {
        console.log("Error in addVersionNumber gulp task", error);
    });
});
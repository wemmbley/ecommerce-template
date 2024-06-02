const {
    src,
    dest
} = require('gulp');
const dotenv = require('gulp-dotenv');
const rename = require('gulp-rename');
const insert = require('gulp-insert');

module.exports = function build_js() {
    return src('.env')
        .pipe(dotenv())
        .pipe(insert.prepend('env = '))
        .pipe(rename('env.js'))
        .pipe(dest('build/js/'))
}
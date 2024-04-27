const {src, dest} = require('gulp');
const include = require('gulp-file-include');
const bs = require('browser-sync');
const prettify = require('gulp-html-prettify');

module.exports = function html() {
    return src([
        'src/**/*.html',
        '!src/components/**/*.html',
        '!src/blocks/**/*.html'
    ])
        .pipe(include({
            prefix: '@',
            basepath: '@file',
        }))
        .pipe(prettify({
            indent_char: '	',
            indent_size: 1
        }))
        .pipe(dest('build'))
        .pipe(bs.stream())
}
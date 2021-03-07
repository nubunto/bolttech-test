const { watch, series } = require('gulp');
const { exec } = require('child_process');

function build(cb) {
    exec('yarn build', () => {
        cb();
    });
}

function format(cb) {
    exec('yarn lint && yarn format', () => {
        cb();
    });
}

exports.format = format;
exports.build = build;

exports.default = (cb) => {
    build(cb);
}

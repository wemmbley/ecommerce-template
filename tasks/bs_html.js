const bs = require('browser-sync');

module.exports = function bs_html() {
    bs.init({
        server: {
            baseDir: 'build/',
            host: '192.168.0.104',
        },
        browser: 'default',
        logPrefix: 'BS-HTML:',
        logLevel: 'info',
        logConnections: true,
        logFileChanges: true,
        open: true
    })
}
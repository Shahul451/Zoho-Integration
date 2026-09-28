const fs = require('fs');

try {
    fs.appendFileSync(
        './startup-log.txt',
        `\n[START] ${new Date().toISOString()}\n`
    );

    console.log('Starting root server.js...');
    console.log('Loading ./dist/server.js...');

    require('./dist/server.js');

    fs.appendFileSync(
        './startup-log.txt',
        `[SUCCESS] dist/server.js loaded ${new Date().toISOString()}\n`
    );

} catch (error) {
    const errorMessage =
        `\n[ERROR] ${new Date().toISOString()}\n` +
        `${error.stack || error}\n`;

    fs.appendFileSync('./startup-error.txt', errorMessage);

    console.error('FAILED TO START APPLICATION');
    console.error(error);

    throw error;
}
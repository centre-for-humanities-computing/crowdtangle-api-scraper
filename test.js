

function test() {
    const credentials = require('./credentials').token;
    const query = 'vaccine';
    const dest = 'd:/temp/crowdtangle';
    const from = '2021-02-27';
    const to = '2021-02-28';
    const filenamePrefix = 'test2';
    const language = 'da';
    const platforms = "facebook";

    let args = [
        '-k', credentials,
        '-q', query,
        '-d', dest,
        '-p', filenamePrefix,
        '-f', from,
        '-t', to,
        '-l', language,
        '-o', platforms,
        '-z' // developer mode, console.log
    ];

    process.argv.push(...args);

    const cli = require('./search');


}
test();

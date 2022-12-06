

function test() {
    const credentials = require('./credentials').token;
    const query = 'is,and,or'; //split terms by comma e.g.: man,woman,child (OR search)
    const accounts = ''; // a comma separated list s of accounts to search e.g. DonaldTrump,mettefrederiksen.dk
    const dest = 'd:/temp/crowdtangle2';
    const from = '2020-02-27';
    const to = '2022-02-28';
    const filenamePrefix = 'test4';
    const language = ''; // e.g. "da" or "en"
    const platforms = "facebook";

    let args = [
        '-k', credentials,
        '-q', query,
        '-a', accounts,
        '-d', dest,
        '-p', filenamePrefix,
        '-f', from,
        '-t', to,
        '-l', language,
        '-o', platforms,
        '-c', // generate csv
        '-z' // developer mode, console.log
    ];

    process.argv.push(...args);

    const cli = require('./search');
}
test();

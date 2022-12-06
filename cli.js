const cli = require('commander');
const fs = require('fs');
const { CrowdTangleScraper } = require('./crowdtangle-scraper');
const { toCsv } = require('./to-csv');

const optDesc = {
    apiCredentials: `The CrowdTangle API key or a file containing KEY`,
    query: `The term(s) to search for. Separate terms by comma e.g. "war,peace".`,
    accounts: 'Account names to search, leave blank to search everything. Account names should be separated by comma e.g. "DonaldTrump,mettefrederiksen.dk".',
    dest: `The directory where the result should be stored`,
    filename: `The name of the result file`,
    from: `The date to fetch data from in the format "yyyy-mm-dd"`,
    to: `The date to fetch data to (included) in the format "yyyy-mm-dd". To fetch a single day this should be the same as "from"`,
    language: `The iso language code to search for. Eg. "da"`,
    platforms: `The platforms to search. Default: "facebook". Possible values are [facebook, instagram, reddit] multiple platforms should be separated by comma`,
    developmentMode: `Should logging data be printed to the stdout`,
    generateCsv: 'Generate a csv file along with the json file'
};

async function run() {

    try {
        cli.requiredOption('-k, --api-credentials <apiCredentials>', optDesc.apiCredentials);
        cli.requiredOption('-q, --query <query>', optDesc.query);
        cli.option('-a, --accounts <names>', optDesc.accounts);
        cli.requiredOption('-d, --destination <directory>', optDesc.destination);
        cli.option('-p, --filename-prefix <string>', optDesc.filename, 'posts');
        cli.requiredOption('-f, --from <date>', optDesc.from);
        cli.requiredOption('-t, --to <date>', optDesc.to);
        cli.option('-l, --language <languageCode>', optDesc.language);
        cli.option('-o, --platforms <platforms>', optDesc.platforms);
        cli.option('-c, --csv', optDesc.generateCsv);
        cli.option('-z, --development-mode', optDesc.developmentMode);

        cli.parse(process.argv);
        let options = cli.opts();

        let credentialsStr = options.apiCredentials;
        let query = options.query;
        let accounts = options.accounts;
        let destDir = options.destination;
        let filename = options.filenamePrefix;
        let from = options.from;
        let to = options.to;
        let language = options.language;
        let platforms = options.platforms;
        let generateCsv = options.csv;
        let developmentMode = options.developmentMode;

        if (developmentMode) {
            process.env.NODE_ENV = "development";
        } else if (!process.env.NODE_ENV) {
            process.env.NODE_ENV = "production";
        }

        if (fs.existsSync(credentialsStr)) {
            credentialsStr = fs.readFileSync(credentialsStr, 'utf8');
        }
        credentialsStr = credentialsStr.trim();

        let cts = new CrowdTangleScraper(destDir, credentialsStr, (filePath) => {
            if (generateCsv) {
                toCsv(filePath);
            }
        });
        await cts.search(filename, query, accounts, from, to, language, platforms);

    } catch(e) {
        console.error(e);
    }
}

run();
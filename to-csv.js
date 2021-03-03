
const fs = require('fs');
const path = require('path');

https://github.com/CrowdTangle/API/wiki/Post

const CSV_MAPPINGS = [
    { path: 'account.name', type: 'string', csvName: 'Group Name' }, // page name?, User Name ?

    { path: 'id', type: 'string', csvName: 'Facebook Id', converter: (id) => id.split('|')[1] },
    { path: 'subscriberCount', type: 'number', csvName: 'Likes at Posting' },
    // Followers ???
    { path: 'type', type: 'string', csvName: 'Type' },
    { path: 'date', type: 'string', csvName: 'Created' },
    { path: 'statistics.actual.likeCount', type: 'number', csvName: 'Likes' },
    { path: 'statistics.actual.commentCount', type: 'number', csvName: 'Comments' },
    { path: 'statistics.actual.shareCount', type: 'number', csvName: 'Shares' },
    { path: 'statistics.actual.loveCount', type: 'number', csvName: 'Love' },
    { path: 'statistics.actual.wowCount', type: 'number', csvName: 'Wow' },
    { path: 'statistics.actual.hahaCount', type: 'number', csvName: 'Haha' },
    { path: 'statistics.actual.sadCount', type: 'number', csvName: 'Sad' },
    { path: 'statistics.actual.angryCount', type: 'number', csvName: 'Angry' },
    { path: 'statistics.actual.careCount', type: 'number', csvName: 'Care' },
    // Many video columns not present
    { path: 'postUrl', type: 'string', csvName: 'URL' },
    { path: 'message', type: 'string', csvName: 'Message' },
    { path: 'expandedLinks', type: 'string', csvName: 'Link', converter: (links) => links ? links[links.length - 1].original : '' },
    { path: 'caption', type: 'string', csvName: 'Image Text' },
    { path: 'title', type: 'string', csvName: 'Link Text' },
    { path: 'description', type: 'string', csvName: 'Description' },
    { path: 'score', type: 'number', csvName: 'Overperforming Score' },
]

function toCsv(dir) {
    let jsonFiles = fs.readdirSync(dir).filter((filename) => filename.endsWith('ndjson'));

    for (let filename of jsonFiles) {
        let filenamePrefix = path.basename(filename);
        let filePath = path.join(dir, filename);
        let content = fs.readFileSync(filePath,'utf8');
        let json = JSON.parse(content);


        /*
        * brug ovenstående til at lave header for filen (hun første linje) of så for hver post udtrække data til csv.
        * Hvis værdien ikke findes (brug _.get()) sættes "", hvis typen er string skal den sættes i "" når den skrive ud
        * hvis værdi findes og har en converter tag værdi som converter returnerer
        * */
    }
}

const dir = "";
toCsv(dir);

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

//https://github.com/CrowdTangle/API/wiki/Post

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
    { path: 'caption', type: 'string', csvName: 'Image Text' },
    { path: 'title', type: 'string', csvName: 'Link Text' },
    { path: 'description', type: 'string', csvName: 'Description' },
    { path: 'statistics.actual', type: 'number', csvName: 'Total Interactions', converter: (stats) => Object.values(stats).reduce((total, current) => total + current) }, //sum all properties },
    { path: 'score', type: 'number', csvName: 'Overperforming Score' }
];

// find lib der kan skrive til excel kompatibel output
// lav så de selv kan lege med, query, from, to dest. lav CLI så de selv kan køre det

function toCsv(filePath) {
        let filenamePrefix = path.basename(filePath);
        let dest = path.dirname(filePath);
        let fileHandle;
        try {
            fileHandle = fs.openSync(path.join(dest, `${filenamePrefix}.csv`), 'w');
            let content = fs.readFileSync(filePath,'utf8'); // if files becomes to big read line by line instead
            let lines = content.split('\n');
            fs.writeSync(fileHandle, getCsvHeader() + '\n');
            for (let line of lines) {
                if (line.trim().length === 0) {
                    continue;
                }
                let json = JSON.parse(line);
                let row = getCsvRow(json);
                fs.writeSync(fileHandle, row + '\n');
            }
        } finally {
            if (fileHandle) {
                fs.closeSync(fileHandle);
            }
        }

        /*
        * brug ovenstående til at lave header for filen (hun første linje) of så for hver post udtrække data til csv.
        * Hvis værdien ikke findes (brug _.get()) sættes "", hvis typen er string skal den sættes i "" når den skrive ud
        * hvis værdi findes og har en converter tag værdi som converter returnerer
        * */
}

function getCsvRow(json, separator = ';') {
    let columns = [];
    for (let colMapping of CSV_MAPPINGS) {
        let val = _.get(json, colMapping.path);
        if (val === undefined) {
            val = "";
        } else {
            if (colMapping.converter) {
                val = colMapping.converter(val);
            }
            if (colMapping.type === 'string') {
                val = escapeCsvStr(val);
            }
        }
        columns.push(val);
    }
    return columns.join(separator);
}

function getCsvHeader(separator = ';') {
    let columns = [];
    for (let colMapping of CSV_MAPPINGS) {
        columns.push(colMapping.csvName);
    }
    return columns.join(separator);
}

function escapeCsvStr(str) {
    return `"${str.replace(/"/g, '""').replace(/(\r?\n).*/g, ' ')}"`; // make it valid json https://gist.github.com/getify/3667624
}

/*

* når har lavet løsning, installer det på hendes computer. Hun skal have credentials fil
*

* */

module.exports = { toCsv };

toCsv('D:/temp/crowdtangle/test_2021-02-01_2021-02-01.ndjson');

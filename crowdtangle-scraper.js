
const { RateLimiter } = require('./rate-limiter');
const got = require('got');
const { DateTime } = require('luxon');
const fs = require('fs');
const path = require('path');

/**
 * https://github.com/CrowdTangle/API/wiki/Search
 * https://help.crowdtangle.com/en/articles/3443476-api-cheat-sheet
 */

class CrowdTangleScraper {

    #dest;
    #accessToken;
    #rateLimiter;

    constructor(dest, accessToken) {
        this.#dest = dest;
        this.#accessToken = accessToken;
        this.#rateLimiter = new RateLimiter(10, 1);
    }


    /**
     * @param filenamePrefix
     * @param query
     * @param {string} from a date in the format "yyyy-mm-dd"
     * @param {string} to a date in the format "yyyy-mm-dd"
     * @param {string} language the language iso code
     * @param {string} [platforms=facebook] the platform(s) to search. Can be one or more of "facebook", "instagram", "reddit". Combine multiple my comma
     */
    async search(filenamePrefix, query, from, to, language, platforms = "facebook") {

        let endDate = this._parseDate(to);
        try {
            fs.mkdirSync(this.#dest, { recursive: true });

            let currentFrom = this._parseDate(from);
            let currentTo = currentFrom;

            do {
                let fileHandle;

                let pageCount = 0;
                let response;

                try {
                    fileHandle = fs.openSync(path.join(this.#dest, `${filenamePrefix}_${this._getDateStr(currentFrom)}_${this._getDateStr(currentTo)}.ndjson`), 'w');
                    do {
                        let queryArgs = {
                            token: this.#accessToken,
                            searchTerm: query,
                            sortBy: 'date',
                            startDate: this._getCrowdTangleDateStr(currentFrom),
                            endDate: this._getCrowdTangleDateStr(this._getEndOfDate(currentTo)),
                            language,
                            platforms,
                            count: 100,
                            offset: pageCount * 100,
                        };

                        await this.#rateLimiter.ready();

                        response = await got('https://api.crowdtangle.com/posts/search', {
                            searchParams: queryArgs,
                            timeout: 5 * 60 * 1000,
                        }).json();

                        for (let post of response.result.posts) {
                            fs.writeSync(fileHandle, JSON.stringify(post) + '\n');
                        }

                        pageCount++;
                        if (pageCount === 100 && response?.result?.pagination?.nextPage) { // if we run into this make it possible to make smaller from-to intervals
                            console.warn(`Query to broad, reached the maximum pagination pages allowed by crowdtangle (max 10000 result for one query)`);
                        }
                    } while (response?.result?.pagination?.nextPage);
                } finally {
                    if (fileHandle) {
                        fs.closeSync(fileHandle);
                    }
                }
                currentFrom = this._getNextDayDate(currentFrom);
                currentTo = this._getNextDayDate(currentTo);
            } while (currentTo <= endDate);
        } catch(e) {
            console.error(e);
        }

    }

    _parseDate(dateStr) {
        return DateTime.fromFormat(dateStr, 'yyyy-MM-dd', {zone: 'utc'});
    }

    _getNextDayDate(date) {
        return date.plus({ day: 1 });
    }

    _getCrowdTangleDateStr(date) {
        return date.toFormat(`yyyy-MM-dd'T'HH:mm:ss'Z'`);
    }

    _getDateStr(date) {
        return date.toFormat(`yyyy-MM-dd`);
    }

    _getEndOfDate(date) {
        return date.endOf('day');
    }

}

module.exports = { CrowdTangleScraper };



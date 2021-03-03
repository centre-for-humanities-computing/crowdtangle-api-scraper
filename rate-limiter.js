const AwaitLock = require('await-lock').default;
const sleep = require('sleep-promise');

class RateLimiter {

    /**
     * @param interval number of seconds
     * @param tokens the maximum number of tokens for the interval
     */
    constructor(intervalSeconds, tokens) {
        this._interval = intervalSeconds;
        this._tokens = tokens;
        this._currentTokes = tokens;
        this._time = Date.now();
        this._lock = new AwaitLock();
    }

    async ready() {
        try {
            await this._lock.acquireAsync();

            let remainingTime = this._updateIfTimeChange();
            while (this._currentTokes <= 0) {
                await sleep(remainingTime);
                remainingTime = this._updateIfTimeChange();
            }

            this._currentTokes--;
        } catch(e) { // should never happen
            console.error(e);
        } finally {
            this._lock.release();
        }
    }

    _updateIfTimeChange() {
        let now = Date.now();
        if ((now - this._time) >= this._interval * 1000) {
            this._currentTokes = this._tokens;
            this._time = now;
        }
        return this._interval * 1000 - (now - this._time);
    }


}

module.exports = { RateLimiter };
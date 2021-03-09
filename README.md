# CrowdTangle Api Scraper
A tool for extracting post objects from the 
[CrowdTangle](https://help.crowdtangle.com/en/articles/1189612-crowdtangle-api) api.


## Installation
- Install [node.js](https://nodejs.org/en/download/) version 14.11 or higher
- Clone this repository
- Navigate to the root of the repository and run

```
$ npm install
```

## Usage
- Navigate to the root of the repository and run to see the help for the CLI
```
$ node cli -h 
```

### CLI options

- **`-k, --api-credentials <apiCredentials>`** [required] - The CrowdTangle API key or a file containing KEY
- **`-q, --query <query>`** [required] - The term to search for
- **`-d, --destination <directory>`** [required] - The directory where the result should be stored
- **`-p, --filename-prefix <string>`** [optional, default="posts"] - The name of the result file
- **`-f, --from <date>`** [required] - The date to fetch data from in the format "yyyy-mm-dd"
- **`-t, --to <date>`** [required] - The date to fetch data to (included) in the format "yyyy-mm-dd". To fetch a single day this should be the same as "from"
- **`-l, --language <languageCode>`** [optional] - The iso language code to search for. Eg. "da"
- **`-o, --platforms <platforms>`** [optional] - The platforms to search. Default: "facebook". Possible values are [facebook, instagram, reddit] multiple platforms should be separated by comma
- **`-c, --csv`** [optional] - Generate a csv file along with the json file
- **`-z, --development-mode`** [optional] - Should logging data be printed to the stdout

### Full Example
```
$ node cli -k "API-KEY" -q "election" -d "/data/crowdtangle", -f "2019-01-01" -t "2020-01-01" -l "da" -o "facebook" -c
```


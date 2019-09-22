const util = require('util')
const request = require('request-promise-native')
const xmlParser = require('fast-xml-parser');
const collect = require('collect.js');
const makeDir = util.promisify(require('fs').mkdir);
const writeFile = util.promisify(require('fs').writeFile);

require('dotenv').config()

async function run() {
    const response = await request.get(process.env.FEED_URL)

    makeDir('build')

    collect(xmlParser.parse(response).rss.channel.item).filter(item => {
        return item.title.startsWith('Miguel Piedrafita&#039;s Newsletter') || item.title.startsWith('Miguel Piedrafita’s Newsletter')
    }).mapWithKeys(item => {
        let title = item.title.split('#')

        return [/(\d*).*/.exec(title [title.length - 1])[1], item.link]
    }).each((url, id) => {
        request.get(url).then(response => {
            writeFile(`build/${id}.html`, response)
        })
    })
}

run()
// Set our base PATH
global.BASE_PATH = require('path').dirname(require.main.filename);

const utils = require('./lib/utils');
let config = utils.readJsonFile('config/config.json');
config = utils.replace_config_values_with_enviroment_values(config);

if (config.reg === '') {
    console.log('Error: Missing Registration');
    process.exit(1);
}


const compare_the_market = require('./lib/compare_the_market');
compare_the_market.start(config);
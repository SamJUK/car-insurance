// Set our base PATH
global.BASE_PATH = require('path').dirname(require.main.filename);

const utils = require('./lib/utils');

let config = utils.readJsonFile('./config/system.json');

let configFile = process.env.hasOwnProperty('config') ? process.env.config : 'config';
let quoteConfig = utils.readJsonFile(`./config/${configFile}.json`);

Object.assign(config, quoteConfig);

config = utils.replace_config_values_with_enviroment_values(config);

if (config.reg === '') {
    console.log('Error: Missing Registration');
    process.exit(1);
}


// Handle Randomized Data
Array.prototype.random=function(){return this[Math.round(Math.random()*(this.length-1))];};
String.prototype.constructor.random=function(r){let t,n,o="";for(;r>0;)n=r>5?5:r,o+=t=Math.random().toString(36).replace(/[^a-z]+/g,"").substr(0,n),r-=n;return o};

if (config.hasOwnProperty('randomized')) {
    let rnd = utils.readJsonFile('./config/randomized.json');
    let quoteRnd = config.randomized;
    Object.assign(rnd, quoteRnd);

    // Randomize Email
    if (rnd.hasOwnProperty('email')) {
        let email = rnd.email;
        if (rnd.email instanceof Array) {
            email = rnd.email.random();
        }

        email = email.replace('{rnd}', String.random(5));
        config.email = email;
    }

    // Randomize Names
    if (rnd.hasOwnProperty('gender')) {
        if (!['male','female'].includes(rnd.gender)) {
            console.log('Error: Invalid Gender');
            process.exit(1);
        }

        config.first_name = rnd.person.fname[rnd.gender].random();
        config.last_name = rnd.person.lname.random();
    }

    // Randomize Birthday
    if (rnd.hasOwnProperty('age')) {
        let bday = utils.randomDateFromAge(rnd.age);
        config.birth_date.day = bday.getUTCDate();
        config.birth_date.month = (bday.getUTCMonth()+1);
        config.birth_date.year = bday.getUTCFullYear();
    }

    // Randomize Address
    if (rnd.hasOwnProperty('address') && rnd.address instanceof Array) {
        config.address = rnd.address.random();
    }
}

const compare_the_market = require('./lib/compare_the_market');
compare_the_market.start(config);
// Misc functions to make our life easier
const fs = require('fs');

const readJsonFile = path => {
    const file_content = fs.readFileSync(`${global.BASE_PATH}/${path}`, 'utf8');
    return JSON.parse(file_content);
};

// Overwrite the config values if they exist in enviroment variables
const replace_config_values_with_enviroment_values = config => {
    Object.keys(config)
        .forEach(key => {
            if (process.env.hasOwnProperty(key)) {
                config[key] = process.env[key];
            }
        });

    return config;
};


module.exports = {
    readJsonFile: readJsonFile,
    replace_config_values_with_enviroment_values: replace_config_values_with_enviroment_values
};
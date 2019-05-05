// Misc functions to make our life easier
const fs = require('fs');

const readJsonFile = path => {
    const file_content = fs.readFileSync(`${global.BASE_PATH}/${path}`, 'utf8');
    return JSON.parse(file_content);
};

// Overwrite the config values if they exist in enviroment variables
const replace_config_values_with_enviroment_values1 = config => {
    Object.keys(config)
        .forEach(key => {
            if (process.env.hasOwnProperty(key)) {
                config[key] = process.env[key];
            }
        });
    return config;
};
const replace_config_values_with_enviroment_values = config => {
    Object.keys(config)
        .forEach(key => {
            if (process.env.hasOwnProperty(key)) {
                try {
                    let j = JSON.parse(process.env[key]);
                    config[key] = object_merge(config[key], j);
                } catch (e) {
                    config[key] = process.env[key];
                }
            }
        });
    return config;
};

/**
 * Merge params of obj2 into obj1 only if they already exist
 * @param obj1
 * @param obj2
 */
const object_merge = (obj1, obj2) => {
    for (const p in obj2) {
        if (obj2.hasOwnProperty(p) && obj1.hasOwnProperty(p)) {
            obj1[p] = obj2[p];
        }
    }
    return obj1;
};


const rangeFromAge = age => {
    let earliest = new Date();
    earliest.setFullYear(earliest.getFullYear() - age);

    let latest = new Date(earliest);
    latest.setFullYear(latest.getFullYear() - 1);

    return {'earliest': earliest, 'latest': latest};
};

const randomDateFromAgeRange = range => {
    return (
        new Date(
            range.earliest.getTime() + Math.random() *
            (range.latest.getTime() - range.earliest.getTime())
        )
    );
};

const randomDateFromAge = age => {
  return randomDateFromAgeRange(rangeFromAge(age));
};


module.exports = {
    readJsonFile: readJsonFile,
    replace_config_values_with_enviroment_values: replace_config_values_with_enviroment_values,
    rangeFromAge: rangeFromAge,
    randomDateFromAgeRange: randomDateFromAgeRange,
    randomDateFromAge: randomDateFromAge
};
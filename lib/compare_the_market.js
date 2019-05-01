const puppeteer = require('puppeteer');
const cliProgress = require('cli-progress');

const isNullOrUndefined = thing => {
    return (void 0 === thing || thing === null);
};

const exists = (base, path) => {
    if (isNullOrUndefined(base)) {
        return false;
    }
    let np = base;
    for (let i = 0; i < path.length; i++) {
        if (!np.hasOwnProperty(path[i]) || isNullOrUndefined(np[path[i]])) {
            return false;
        }

        np = np[path[i]];
    }

    return true;
};

const nextSection = async selector => {
    await global.page.click(selector);
    await global.page.waitForFunction (
        selector => document.querySelector(selector) === null,
        {polling: 'mutation'},
        selector
    );
};

const processSite = async (config, browser) => {
    global.browser = browser;
    global.page = await global.browser.newPage();
    await page.goto(config.start_url, {'waitUntil': 'networkidle0'});
    global.progress_bar.update(1, {'step':'Selecting Car'});


    /**
     * ===============
     * SECTION 1
     * ===============
     */

    // Click on known reg
    await page.click('[for="CarInsurance_YourVehicle_VehicleDetails_DoYouKnowYourRegNumber_yes"]');

    // Enter Reg
    await page.type('#CarInsurance_YourVehicle_VehicleDetails_RegistrationNumber', config.reg);

    // Click on find vehicle
    await nextSection('#CarInsurance_YourVehicle_VehicleDetails_FindYourVehicle_Submit');
    global.progress_bar.update(2, {'step': 'Vehicle Details'});



    /**
     * ===============
     * SECTION 2
     * ===============
     */

    // Set Alarm State
    await page.select('#CarInsurance_YourVehicle_VehicleDetails_AlarmCode', config.alarm);

    // Set Tracking Device
    let tracking_type = config.tracking_device ? 'yes' : 'no';
    await page.click(`[for="CarInsurance_YourVehicle_VehicleDetails_HasTracker_${tracking_type}"]`);

    // Import Status
    let import_type = config.is_imported ? 'yes' : 'no';
    await page.click(`[for="CarInsurance_YourVehicle_VehicleDetails_Imported_${import_type}"]`);

    // Driving Side
    let driving_side = config.driving_side.toUpperCase();
    await page.click(`[for="CarInsurance_YourVehicle_VehicleDetails_DriverSide_${driving_side}"]`);

    // Seat Count
    await page.select('#CarInsurance_YourVehicle_VehicleDetails_NumberOfSeats', config.seat_count.toString());

    // Vehicle Value
    if (config.vehicle_value !== null) {
        let selector = 'CarInsurance_YourVehicle_VehicleDetails_CurrentValue';
        await page.evaluate((selector,value) => {
            document.querySelector(selector).value = value;
        }, selector, config.vehicle_value);
    }

    // Modifications
    // @TODO: IF YES HANDLE THE POPUP
    let mods = config.modifications !== null
        ? 'yes' : 'no';
    await page.click(`[for="CarInsurance_YourVehicle_VehicleDetails_HasBeenModified_${mods}"]`);

    await nextSection('#CarInsurance_YourVehicle_VehicleDetails_Section_Next');
    global.progress_bar.update(3, {'step': 'Vehicle Usage'});

    /**
     * ===============
     * SECTION 3
     * ===============
     */

    // Set purchase date
    if (config.purchase_date === null) {
        page.click('[for="CarInsurance_YourVehicle_VehicleUsage_WhenDidYouBuyTheCar_NotYet"]');
    } else {
        page.select('#CarInsurance_YourVehicle_VehicleUsage_WhenDidYouBuyTheCar_MonthYear_month', config.purchase_date.month);
        page.select('#CarInsurance_YourVehicle_VehicleUsage_WhenDidYouBuyTheCar_MonthYear_year', config.purchase_date.year);
    }

    // Car use case
    // @TODO: Add case for Business Use
    let usage = config.usage;
    await page.click(`[for="CarInsurance_YourVehicle_VehicleUsage_VehicleIsUsedFor_${usage}"]`);

    // Personal Mileage
    await page.type('#CarInsurance_YourVehicle_VehicleUsage_AnnualPersonalMileage', config.personal_mileage.toString());

    // Day Storage
    let day_storage = config.day_storage;
    await page.click(`[for="CarInsurance_YourVehicle_VehicleUsage_VehicleKeptDuringTheDay_${day_storage}"]`);

    // Night Storage
    // @TODO: Add support for 'other' dropdown
    let night_storage = config.night_storage;
    await page.click(`[for="CarInsurance_YourVehicle_VehicleUsage_OvernightParking_${night_storage}"]`);

    // Kept at home over night
    // @TODO: Add support to enter address for 'no'
    let kept_at_home_at_night = config.kept_at_home_at_night
        ? 'home'
        : 'elsewhere';
    await page.click(`[for="CarInsurance_YourVehicle_VehicleUsage_VehicleLocationOvernight_${kept_at_home_at_night}"]`);

    // How many cars are kept here
    await page.select('#CarInsurance_YourVehicle_VehicleUsage_NumberOfVehiclesInHousehold', config.total_cars_at_household.toString());

    // Access to another vehicle
    await page.select('#CarInsurance_YourVehicle_VehicleUsage_UseOfAnyOtherVehicle', config.use_of_another_vehicle)


    // Progress to next section
    await nextSection('#CarInsurance_YourVehicle_VehicleUsage_Section_Next');
    global.progress_bar.update(4, {'step': 'Personal Details'});



    /**
     * ===============
     * SECTION 4
     * ===============
     */

    // Set Title
    // @TODO: Add randomization to this part
    await page.select('#CarInsurance_YourDetails_PersonalDetails_Title', config.title);

    // Set First Name
    // @TODO: Add randomization to this part
    await page.type('#CarInsurance_YourDetails_PersonalDetails_FirstName', config.first_name);

    // Set Last Name
    // @TODO: Add randomization to this part
    await page.type('#CarInsurance_YourDetails_PersonalDetails_LastName', config.last_name);

    // Set Birthdate
    // @TODO: Add some randomization to this (while keeping age the same)
    await page.select('#CarInsurance_YourDetails_PersonalDetails_DateOfBirth_day', config.birth_date.day.toString());
    await page.select('#CarInsurance_YourDetails_PersonalDetails_DateOfBirth_month', (config.birth_date.month-1).toString());
    await page.select('#CarInsurance_YourDetails_PersonalDetails_DateOfBirth_year', config.birth_date.year.toString());

    // Set Relationship
    await page.select('#CarInsurance_YourDetails_PersonalDetails_RelationshipStatus', config.relationship);

    // Home Ownership
    let home_ownership = config.home_ownership ? 'yes' : 'no';
    await page.click(`[for="CarInsurance_YourDetails_PersonalDetails_OwnsHome_${home_ownership}"]`);

    // U18 Children
    let u18_children = config.u18_children ? 'yes' : 'no';
    await page.click(`[for="CarInsurance_YourDetails_PersonalDetails_HasChildrenUnderSixteen_${u18_children}"]`);

    // Address
    // @TODO: Randomizate this within local area
    await page.click('#CarInsurance_YourDetails_PersonalDetails_Address_GoToManual');
    await page.type('#CarInsurance_YourDetails_PersonalDetails_Address_Manual_Line1', config.address.line1.toString());
    if (exists(config,["address","line2"])) {
        await page.type('#CarInsurance_YourDetails_PersonalDetails_Address_Manual_Line2', config.address.line2.toString());
    }
    if (exists(config,["address","line3"])) {
        await page.type('#CarInsurance_YourDetails_PersonalDetails_Address_Manual_Line3', config.address.line3.toString());
    }
    await page.type('#CarInsurance_YourDetails_PersonalDetails_Address_Manual_Line4',config.address.city);
    await page.type('#CarInsurance_YourDetails_PersonalDetails_Address_Manual_Postcode',config.address.postcode);

    // Employment
    // @TODO: Add logic for other employment states
    await page.select('#CarInsurance_YourDetails_PersonalDetails_EmploymentStatus', config.employment.type);
    if (config.employment.type === 'E') {
        await page.type('#CarInsurance_YourDetails_PersonalDetails_PrimaryOccupation', config.employment.job);
        // Wait for autocomplete to finish looking up the latest jobs
        // @TODO: Move to wait for the ajax job to finish
        await page.waitFor(500);

        // Press down and enter to select first in autocomplete list
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        await page.type('#CarInsurance_YourDetails_PersonalDetails_PrimaryOccupationBusinessType', config.employment.industry);
        // Wait for autocomplete to finish looking up the latest jobs
        // @TODO: Move to wait for the ajax job to finish
        await page.waitFor(250);

        // Press down and enter to select first in autocomplete list
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
    }

    // Time lived in uk
    // @TODO: Add logic if not from birth
    await page.click('[for="CarInsurance_YourDetails_PersonalDetails_HowLongLivedInUK_SinceBirth"]');

    // Driving History
    // @TODO: Add logic for provisional
    if (config.full_driving_licence) {
        await page.click('[for="CarInsurance_YourDetails_PersonalDetails_LicenceType_full"]');
    } else {
        await page.click('[for="CarInsurance_YourDetails_PersonalDetails_LicenceType_provisional"]');
        config.licence_location = 'uk';
    }

    // Vehicle type
    if (config.licence_location === 'uk' && config.full_driving_licence) {
        let licence_allows_manual = config.licence_allows_manual
            ? 'manual'
            : 'automatic';
        await page.click(`[for="CarInsurance_YourDetails_PersonalDetails_LicenceTransmissionType_${licence_allows_manual}"]`);
    }

    // Provide Licence Number
    let providing_licence = config.licence_number === null ? 'no': 'yes';
    await page.click(`[for="CarInsurance_YourDetails_PersonalDetails_ProvideLicenceNumber_${providing_licence}"]`);

    if (config.licence_location === 'uk' && config.licence_number !== null) {
        await page.type('#CarInsurance_YourDetails_PersonalDetails_LicenceNumber_PartOne', config.licence_number[0]);
        await page.type('#CarInsurance_YourDetails_PersonalDetails_LicenceNumber_PartTwo', config.licence_number[1]);
        await page.type('#CarInsurance_YourDetails_PersonalDetails_LicenceNumber_PartThree', config.licence_number[2]);
        await page.type('#CarInsurance_YourDetails_PersonalDetails_LicenceNumber_PartFour', config.licence_number[3]);
    }

    // How long license held
    await page.select('#CarInsurance_YourDetails_PersonalDetails_NumberOfYearsLicenceHeld', config.licence_age.toString());

    // When was the licence received
    await page.select('#CarInsurance_YourDetails_PersonalDetails_LicenceIssueDate_month', config.licence_received.month.toString());
    await page.select('#CarInsurance_YourDetails_PersonalDetails_LicenceIssueDate_year', config.licence_received.year.toString());

    // Additional Driving Qualifications
    if (config.additional_driving_qualifications !== null) {
        await page.click('[for="CarInsurance_YourDetails_PersonalDetails_HasPassedAdditionalDrivingQualifications_yes"]');
        // @TODO: Fill this out
    } else {
        await page.click('[for="CarInsurance_YourDetails_PersonalDetails_HasPassedAdditionalDrivingQualifications_no"]');
    }

    // Medical Conditions
    if (config.medical_conditions === null) {
        await page.click('[for="CarInsurance_YourDetails_PersonalDetails_HasMedicalConditions_no"]');
    } else {
        await page.click('[for="CarInsurance_YourDetails_PersonalDetails_HasMedicalConditions_yes"]');
        await page.select('#CarInsurance_YourDetails_PersonalDetails_MedicalCondition', config.medical_conditions);
    }

    // Policy Canceled
    let policy_canceled = config.policy_canceled ? 'yes' : 'no';
    await page.click(`[for="CarInsurance_YourDetails_PersonalDetails_HasHadInsurancePolicyDeclined_${policy_canceled}"]`);

    // Claims
    if (config.claims === null) {
        await page.click('[for="CarInsurance_YourDetails_PersonalDetails_Claims_HasClaims_no"]');
    } else {
        await page.click('[for="CarInsurance_YourDetails_PersonalDetails_Claims_HasClaims_yes"]');
        // @TODO: Fill pout popup
    }

    // Convictions
    if (config.convictions === null) {
        await page.click('[for="CarInsurance_YourDetails_PersonalDetails_Convictions_HasConvictions_no"]');
    } else {
        await page.click('[for="CarInsurance_YourDetails_PersonalDetails_Convictions_HasConvictions_yes"]');
        // @TODO: Fill out popup
    }

    // Unspent Convictions
    let unspect_convictions = config.unspent_convictions
        ? 'yes' : 'no';
    await page.click(`[for="CarInsurance_YourDetails_PersonalDetails_Convictions_HasNonMotorConvictions_${unspect_convictions}"]`);


    // Progress to next section
    await nextSection('#CarInsurance_YourDetails_PersonalDetails_Section_Next');
    global.progress_bar.update(5, {'step': 'Additional Drivers'});



    /**
     * ===============
     * SECTION 5
     * ===============
     */
    let additional_drivers = config.additional_drivers;
    if (additional_drivers instanceof Array && additional_drivers.length > 0) {
        await page.click('[for="CarInsurance_YourDetails_AdditionalDrivers_AnyAdditionalDrivers_yes"]');

        for(let i = 0; i < additional_drivers.length; i++) {
            let driver = additional_drivers[i];

            // Set Relationship
            await page.select('#CarInsurance_YourDetails_AdditionalDrivers_RelationshipToProposer', driver.relationship);

            // Set Title
            await page.select('#CarInsurance_YourDetails_AdditionalDrivers_Title', driver.title);

            // Set First Name
            await page.type('#CarInsurance_YourDetails_AdditionalDrivers_FirstName', driver.first_name);

            // Set Last Name
            await page.type('#CarInsurance_YourDetails_AdditionalDrivers_LastName', driver.last_name);

            // Set Birthdate
            await page.select('#CarInsurance_YourDetails_AdditionalDrivers_DateOfBirth_day', driver.birth_date.day.toString());
            await page.select('#CarInsurance_YourDetails_AdditionalDrivers_DateOfBirth_month', (driver.birth_date.month-1).toString());
            await page.select('#CarInsurance_YourDetails_AdditionalDrivers_DateOfBirth_year', driver.birth_date.year.toString());

            // Set Relationship status
            await page.select('#CarInsurance_YourDetails_AdditionalDrivers_RelationshipStatus', driver.relationship_status);

            // Set Employment details
            await page.select('#CarInsurance_YourDetails_AdditionalDrivers_EmploymentStatus', driver.employment.status);

            if (driver.employment.status === "E") {
                await page.type('#CarInsurance_YourDetails_AdditionalDrivers_PrimaryOccupation', driver.employment.job);
                await page.waitFor(250);
                await page.keyboard.press('ArrowDown');
                await page.keyboard.press('Enter');

                await page.type('#CarInsurance_YourDetails_AdditionalDrivers_PrimaryOccupationBusinessType', driver.employment.industry);
                await page.waitFor(250);
                await page.keyboard.press('ArrowDown');
                await page.keyboard.press('Enter');
            }

            // Time lived in uk
            await page.click('[for="CarInsurance_YourDetails_AdditionalDrivers_HowLongLivedInUK_SinceBirth"]');

            if (driver.full_driving_licence) {
                await page.click('[for="CarInsurance_YourDetails_AdditionalDrivers_LicenceType_full"]');
            } else {
                await page.click('[for="CarInsurance_YourDetails_AdditionalDrivers_LicenceType_provisional"]');
                driver.licence_location = 'uk';
            }

            // Vehicle type
            if (driver.licence_location === 'uk' && driver.full_driving_licence) {
                let licence_allows_manual = driver.licence_allows_manual ? 'manual' : 'automatic';
                await page.click(`[for="CarInsurance_YourDetails_AdditionalDrivers_LicenceTransmissionType_${licence_allows_manual}"]`);
            }

            // Provide Licence Number
            if (driver.licence_location === 'uk' && driver.licence_number !== null) {
                await page.type('#CarInsurance_YourDetails_AdditionalDrivers_LicenceNumber_PartOne', driver.licence_number[0]);
                await page.type('#CarInsurance_YourDetails_AdditionalDrivers_LicenceNumber_PartTwo', driver.licence_number[1]);
                await page.type('#CarInsurance_YourDetails_AdditionalDrivers_LicenceNumber_PartThree', driver.licence_number[2]);
                await page.type('#CarInsurance_YourDetails_AdditionalDrivers_LicenceNumber_PartFour', driver.licence_number[3]);
            }

            // How long license held
            await page.select('#CarInsurance_YourDetails_AdditionalDrivers_NumberOfYearsLicenceHeld', driver.licence_age.toString());

            // Use of another vehicle
            await page.select('#CarInsurance_YourDetails_AdditionalDrivers_UseOfAnyOtherVehicle', driver.use_of_another_vehicle);

            // Medical Conditions
            if (driver.medical_conditions === null) {
                await page.click('[for="CarInsurance_YourDetails_AdditionalDrivers_HasMedicalConditions_no"]');
            } else {
                await page.click('[for="CarInsurance_YourDetails_AdditionalDrivers_HasMedicalConditions_yes"]');
                await page.select('#CarInsurance_YourDetails_AdditionalDrivers_MedicalCondition', driver.medical_conditions);
            }

            // Policy Canceled
            let policy_canceled = driver.policy_canceled ? 'yes' : 'no';
            await page.click(`[for="CarInsurance_YourDetails_AdditionalDrivers_HasHadInsurancePolicyDeclined_${policy_canceled}"]`);

            // Claims
            if (driver.claims === null) {
                await page.click('[for="CarInsurance_YourDetails_AdditionalDrivers_Claims_HasClaims_no"]');
            } else {
                await page.click('[for="CarInsurance_YourDetails_AdditionalDrivers_Claims_HasClaims_yes"]');
                // @TODO: Fill pout popup
            }

            // Convictions
            if (driver.convictions === null) {
                await page.click('[for="CarInsurance_YourDetails_AdditionalDrivers_Convictions_HasConvictions_no"]');
            } else {
                await page.click('[for="CarInsurance_YourDetails_AdditionalDrivers_Convictions_HasConvictions_yes"]');
                // @TODO: Fill out popup
            }

            // Unspent Convictions
            let unspect_convictions = driver.unspent_convictions ? 'yes' : 'no';
            await page.click(`[for="CarInsurance_YourDetails_AdditionalDrivers_Convictions_HasNonMotorConvictions_${unspect_convictions}"]`);

            // Submit Driver
            await nextSection('#CarInsurance_YourDetails_AdditionalDrivers_SaveDriver_Submit');

            if (i < (additional_drivers.length-1)) {
               await nextSection('#CarInsurance_YourDetails_AdditionalDrivers_Section_Back');
            }
        }


    } else {
        await page.click('[for="CarInsurance_YourDetails_AdditionalDrivers_AnyAdditionalDrivers_no"]');
    }

    // return false;

    // Progress to next section
    await nextSection('#CarInsurance_YourDetails_AdditionalDrivers_Section_Submit');
    global.progress_bar.update(6, {'step':'Policy Details'});



    /**
     * ===============
     * SECTION 6
     * ===============
     */

    // Main Driver
    if (config.main_driver !== null) {
        let main_driver_id = await page.evaluate(
            name => Array.from(document.querySelectorAll('#CarInsurance_YourPolicy_PolicyDetails_MainDriver option')).filter(e => e.textContent === name)[0].value,
            config.main_driver
        );
        await page.select('#CarInsurance_YourPolicy_PolicyDetails_MainDriver', main_driver_id);
    }

    // Register Keeper
    let you_are_the_register_keeper = config.you_are_the_register_keeper
        ? 'yes' : 'no';
    await page.click(`[for="CarInsurance_YourPolicy_PolicyDetails_TheRegisteredKeeper_${you_are_the_register_keeper}"]`);

    // Cover Type
    await page.select('#CarInsurance_YourPolicy_PolicyDetails_CoverType', config.cover_type);

    // Payment Frequency
    let payment_frequency = config.monthly_payments ? 'M' : 'F';
    await page.click(`[for="CarInsurance_YourPolicy_PolicyDetails_PaymentFrequency_${payment_frequency}"]`);

    // Start Date
    let date = new Date();
    date.setDate(date.getDate() + config.start_date);

    let year = date.getFullYear();

    let month = (date.getMonth()+1);
    month = month.toString().padStart(2, '0');

    let day = date.getDate();

    // Issue with CTM where the validation works of UTC but frontend inputs are off BST
    if ((config.start_date === 29) && (new Date()).getUTCDate() !== (new Date()).getDate()) {
        day = 1;
    }

    day = day.toString().padStart(2, '0');

    let sdate = `${year}-${month}-${day}`;
    await page.select('#CarInsurance_YourPolicy_PolicyDetails_CoverStartDate', sdate);

    // Excess
    await page.select('#CarInsurance_YourPolicy_PolicyDetails_VoluntaryExcess', config.excess.toString());

    // NCB
    // @TODO: if 0 - Any named driver exp
    // @TODO: if > 3 NCB protection
    await page.select('#CarInsurance_YourPolicy_PolicyDetails_NCDPeriod', config.ncb.toString());

    // How did earn NCB
    let earn_ncb = config.how_did_earn_ncb.toString();
    await page.click(`[for="CarInsurance_YourPolicy_PolicyDetails_SourceOfNCD_${earn_ncb}"]`);


    // Progress to next section
    await nextSection('#CarInsurance_YourPolicy_PolicyDetails_Section_Next');
    global.progress_bar.update(7, {'step':'Additional Cover'});



    /**
     * ===============
     * SECTION 7
     * ===============
     */

        // personal_accident_cover
    let personal_accident_cover = config.personal_accident_cover ? 'yes' : 'no';
    await page.click(`[for="CarInsurance_YourPolicy_AdditionalProductsAndFeatures_PersonalAccidentCover_${personal_accident_cover}"]`);

    // courtesy_car
    let courtesy_car = config.courtesy_car ? 'yes' : 'no';
    await page.click(`[for="CarInsurance_YourPolicy_AdditionalProductsAndFeatures_CourtesyCar_${courtesy_car}"]`);

    // breakdown_cover
    let breakdown_cover = config.breakdown_cover ? 'yes' : 'no';
    await page.click(`[for="CarInsurance_YourPolicy_AdditionalProductsAndFeatures_BreakdownCover_${breakdown_cover}"]`);

    // motor_legal_protection
    let motor_legal_protection = config.motor_legal_protection ? 'yes' : 'no';
    await page.click(`[for="CarInsurance_YourPolicy_AdditionalProductsAndFeatures_MotorLegalProtection_${motor_legal_protection}"]`);

    // Progress to next section
    await nextSection('#CarInsurance_YourPolicy_AdditionalProductsAndFeatures_Section_Submit');
    global.progress_bar.update(8, {'step':'Contact Methods'});



    /**
     * ===============
     * SECTION 8
     * ===============
     */

    // Set email
    await page.type('#CarInsurance_YourPolicy_YourAccountAndContactDetails_Email', config.email);

    // Set phone
    if (config.phone !== null) {
        await page.type('#CarInsurance_YourPolicy_YourAccountAndContactDetails_MainTelephoneNumber', config.phone);
    }

    // Allow callback
    let callback = config.allow_callback ? 'yes' : 'no';
    await page.click(`[for="CarInsurance_YourPolicy_YourAccountAndContactDetails_ProviderContact_${callback}"]`);

    // Keep up to date
    if (config.keep_up_to_date.length > 0) {
        let method = '';
        for(let i = 0; i < config.keep_up_to_date; i++) {
            method = config.keep_up_to_date[i];
            await page.click(`[for="ContactPreferences_${method}"]`);
        }
    } else {
        await page.click('#ContactPreferences_nocontact');
    }

    // Agree to terms
    await page.click('[for="CarInsurance_YourPolicy_YourAccountAndContactDetails_TermsAndConditions_Checkbox"]');

    // Progress to next section
    await nextSection('#CarInsurance_YourPolicy_YourAccountAndContactDetails_Section_Submit');
    global.progress_bar.update(9, {'step': 'Fetching Quotes'});



    /**
     * ===============
     * SECTION 9
     * ===============
     */

    // Progress to next section
    await page.click('#CarInsurance_YourSummary_GetQuotes_Submit');
    // @TODO: Refactor out the sleep
    await page.waitFor(2000);
    await page.waitForFunction(
        () => (
            document.querySelectorAll('#CarInsurance_YourQuotes_Interstitial').length === 0),
        {polling: 'mutation',timeout: 120000}
    );

    global.progress_bar.update(10, {'step': 'Quotes Extracted'});
    global.progress_bar.stop();


    /**
     * EXTRACT THE QUOTES
     * @TODO: Extract [Breakdown cover, Courtesy car, Personal accident cover, Motor legal protection]
     */
    let data = await page.evaluate(() => {
        return {
            car: document.querySelector('#CarInsurance_YourQuotes_DemandsAndNeeds_Statement > strong').textContent,
            quotes: Array.from(document.querySelectorAll('li[id*="CarInsurance_YourQuotes_Quotes_"]')).map(q => {
                return {
                    name: q.querySelector('[class^="styles_Provider__image__"]').getAttribute('alt'),
                    price: q.querySelector('[id*="AnnualPremium"]').textContent,
                    excesses: Array.from(q.querySelectorAll('[id*="Excesses"] tr')).map(e => {
                        let l = e.querySelector('[id*="Label"]').textContent;
                        let v = e.querySelector('[id*="Value"]').textContent;
                        return `${l} - ${v}`;
                    }),
                    telematics: (q.querySelector('[id*="Telematics"]') !== null),
                };
            })
        }
    });

    /**
     * OUTPUT THE DATA
     */

    let out = [];
    let car = data.car;
    let quotes = data.quotes;
    if (config.output.detail === 'simple') {
        quotes = quotes.map(q => `${q.name} - ${q.price}${(q.telematics)?' - Telematics':''}`);
    } else {
        quotes = quotes.map(q => `${q.name} - ${q.price}${(q.telematics)?' - Telematics':''} - E: [${q.excesses.join(' | ')}]`);
    }

    if (config.output.format === 'text') {
        let spacer = '=====================';

        out.push(spacer);
        out.push((new Date).toISOString());
        out.push(`${config.reg} - ${car.split(',').shift()}`);
        out.push(spacer);
        out.push(quotes.join('\n'));
        out.push(spacer);
        out = out.join('\n');

    } else if(config.output.format === 'json') {
        data.time = (new Date).toISOString();
        out = JSON.stringify(data);
    }

    if (config.output.type === 'stdout') {
        console.log(out);
    }

    if (process.env.hasOwnProperty('env') && process.env.env !== 'dev') {
        global.browser.close();
    }
};

const handleError = err => {
    global.progress_bar.stop();
    console.log(`Error: ${err}`);

    if (process.env.hasOwnProperty('env') && process.env.env !== 'dev') {
        global.browser.close();
        process.exit(1);
    }
};

const start = async config => {
    global.progress_bar = new cliProgress.Bar({
        'format': '[{bar}] {percentage}% | {value}/{total} | {step}'
    }, cliProgress.Presets.shades_classic);

    global.progress_bar.start(10, 0, {'step':'Opening Site'});
    create_puppeteer(config.puppeteer)
        .then(processSite.bind(this, config))
        .catch(handleError);
};

const create_puppeteer = async config => {
    return (await puppeteer.launch(config));
};

module.exports = {
    start: start
};
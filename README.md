# Automated Car Insurance Checker
Node JS Script built using puppeteer to remove the repetition and reduce the time of running car insurance quotes. Currently only supports Compare the market, but will expand to cover multiple comparison sites as well as using mixed fake names & address in your area 


## Contents
- [Install](#Install)
- [TODO](#TODO)
- [Settings](#Settings)

## Install
 1) Clone this repository `git clone https://github.com/SamJUK/car-insurance && cd car-insurance`
 2) Install dependencies `npm install`
 3) Create your config file `cp config/config.example.json config/config.json`
 4) Go over your config settings make sure they are correct. (Available values listed below)
 5) Run the script (environment variables will override config ones) `reg="AA00AAA" node index.js`

## TODO
- Catch invalid regs (hangs and dies atm)
- Fix @TODO's
- If errors are throw in the site, relay them to the console
- Create a dictionary for config options so they are more descriptive
- Support for other comparison sites
    - Go Compare
    - Money Supermarket
- Add support for proxies to prevent any IP spam detection / price raises etc
- Web frontend for easier use of application
- Car details in data output
- Improve code (abstract into different functions for sections / points etc)
- Output a link to continue with the quotes
- Ability to search multiple registrations at a time

## Settings
### Section1
### Section 2
- ALARM
    - `99991` = Factory Fitted Thatcham Approved Alarm/Immobiliser
    - `99992` = Factory Fitted Thatcham Approved Alarm
    - `99993` = Factory Fitted Non-Thatcham Alarm/Immobiliser
    - `99994` = Factory Fitted Non-Thatcham Alarm
    - `\#F` = Factory Fitted
    - `\#N` = None
- Driving Side
    - `RHD` = Right hand drive
    - `LHD` = Left hand drive
- seat_count
    - `Range(1,9)`
- vehicle_value
    - `null` = Uses default it finds
- modifications
    - `null` = No Mods

### Section 3
- Purchase Date
    - `null` = Not bought yet
    - `{month: x, year: y}` 
    - x `(0-11)|(jan,dec)`
    - y `(full year (2019,2018,2017 etc))`

- Usage
    - `05NN` - Social, domestic and pleasure only (SDP)
    - `02YN` - Social, domestic, pleasure and commuting (SDPC)
    - `SBU` - SDPC and Business Use

- Day Storage (Where is it kept in the day)
    - `VKD1` - At home
    - `VKD2` - Office or factory car park
    - `VKD3` - Open public car park
    - `VKD4` - Secure public car park
    - `VKD5` - Street away from home

- Night Storage (Where its kept at night)
    - `4`  - Drive 
    - `10` - Locked Garage
    - `11` - Unlocked Garage
    - `12` - Street Outside Home
    - `13` - Street Away from Home
    - `other` - Other

- total_cars_at_household
    - `range(1, 9)`

- Use of another vehicle
    - `XVE` - No access to any other vehicles
    - `1VE` - Own another car or van
    - `UVE` - Have use of another car
    - `COVE` - Company car (including personal use)
    - `CXVE` - Company car (excluding personal use)

### Section 4
- Title
    - `MR`
    - `MRS`
    - `MS`
    - `MISS`

- Birth Date
    - `day` - `range(1-31)`
    - `month` - `range(1-12)`
    - `year` - `Full format (1992,1999,2003 etc)`

- Relationship
    `M` - Married
    `B` - Civil Partnered
    `S` - Single
    `P` - Common Law Partnered/Cohabiting
    `D` - Divorced/Dissolved
    `A` - Separated
    `W` - Widowed/Surviving Civil Partner

- Address
    - `line1` - Mandatory 
    - `line2` - Optional
    - `line3` - Optional
    - `city` - Mandatory
    - `postcode` - Mandatory

- Employment
    - `type`
        - `E` - Employed
        - `U` - Unemployed
        - `S` - Self-Employed
        - `H` - House Person
        - `F` - Full/Part Time Education
        - `R` - Retired
        - `N` - Not Employed Due To Disability/Illness


- time_in_uk (Time lived in uk)
    - `null` - From Birth

- licence_location (Not needed if provisional)
    - `uk`
    - `eu`
    - `non-eu`
    - `international`

- licence_allows_manual (Only needed if full uk licence)

- licence_number
    - `null` - Not providing one
    - `[seg1,seg2,seg3,seg4]` Array with segments

- licence_age
    - `0` - Less than 1 year
    - `1 - 25`

- licence_received
    - `month` - `range(0, 11)`
    - `year` - `Full format (2019,2015,2010)` etc 

- additional_driving_qualifications
    - `null` - None

- medical_conditions
    - `null` - None
    - `DVR` - DVLA aware - No restrictions
    - `DV1` - DVLA aware - 1 year restricted Licence
    - `DV2` - DVLA aware - 2 year restricted Licence
    - `DV3` - DVLA aware - 3 year restricted Licence
    - `DVU` - DVLA unaware

- claims
    - `null` - None

- convictions
    - `null` - None

### Section 5
- additional_drivers
    - `null` - none
    - array of objects
        - relationship
            - `S` - Spouse
            - `J` - Civil Partner
            - `W` - Common Law Partner/Cohabitee
            - `O` - Son/Daughter
            - `M` - Parent
            - `F` - Other Family
            - `E` - Employee
            - `B` - Employer
            - `C` - Business Partner
            - `U` - Other
            - `R` - Brother/Sister
        
        - title
            - `MR` - Mr
            - `MRS` - Mrs
            - `MS` - Ms
            - `MISS` - Miss
            
        - relationship_status
            - `M` - Married
            - `B` - Civil Partnered
            - `S` - Single
            - `P` - Common Law Partnered/Cohabiting
            - `D` - Divorced/Dissolved
            - `A` - Separated
            - `W` - Widowed/Surviving Civil Partner
            
        - employment_status
            - `E` - Employed
            - `U` - Unemployed
            - `S` - Self-Employed
            - `H` - House Person
            - `F` - Full/Part Time Education
            - `R` - Retired
            - `N` - Not Employed Due To Disability/Illness
        
        - employment
            - job (selects first in dropdown)
            - industry (selects first in dropdown)
        
        - time_in_uk
            - `null` - Since birtyj
         
        - full_driving_licence
            - true/false
            
        - licence_location (Not needed if provisional)
            - `uk`
            - `eu`
            - `non-eu`
            - `international`
        
        - licence_allows_manual (Only needed if full uk licence)
        
        - licence_number
            - `null` - Not providing one
            - `[seg1,seg2,seg3,seg4]` Array with segments
        
        - licence_age
            - `0` - Less than 1 year
            - `1 - 25`
            
        - Use of another vehicle
            - `XVE` - No access to any other vehicles
            - `1VE` - Own another car or van
            - `UVE` - Have use of another car
            - `COVE` - Company car (including personal use)
            - `CXVE` - Company car (excluding personal use)
        


### Section 6
- main_driver
    - `null` - Default
    - `Mr John Doe` - prefix + fname + lname of main driver

- cover_type
    - `01` - Comprehensive
    - `02` - Third Party Fire and Theft
    - `03` - Third Party Only

- monthly_payments
    - `false` = Yearly
    - `true` = Monthly

- start_date
    - `0` - Today
    - `1 - 29` - Days+
    
- Excess
    - `0` - None
    - `50-1000` - Intervals of 50

- NCB
    - `range(0, 20)`

- how_did_earn_ncb
    - `1` - With this vehicle or a previous vehicle
    - `3` - With a company vehicle
    - `4` - In another country

- keep_up_to_date
    - Empty Array = dont contact
    - `email`
    - `sms`
    - `telephone`
    - `post`

"use strict";

var config = module.exports = {};

//logging (Bunyan)
config.logging = {
    level: 'trace', //logging.level possible values: fatal, error, warn, info, debug, trace
    logFolder: 'log',
    filename: 'blue-button-gen-fhir.log',
    logRequests: true,
    period: '1d', //one of "h"(hours), "d"(days), "w"(weeks), "m"(months), "y"(years)
    count: 10 //number of rotated files to keep
};

config.ccdaVitalSignPanels = {
    panels: [{
        code: '35094-2',
        display: 'Blood pressure panel',
        system: "http://loinc.org",
        children: [
            '8480-6', //Systolic blood pressure
            '8462-4' //Diastolic blood pressure
        ]
    }, {
        code: '55418-8',
        display: 'Weight and Height tracking panel',
        system: "http://loinc.org",
        children: [
            '29463-7', //Body Weight
            '3141-9', //Body Weight Measured
            '8302-2', //Body Height
            '39156-5' //Body mass index (BMI)
        ]
    }]
};

"use strict";

var medication = require('./medication');
var allergy = require('./allergy');
var problem = require('./problem');
var result = require('./result');
var vital = require('./vital');
var demographics = require('./demographics');

var rootLogger = require('../log');

var logger = rootLogger.child({
    module: 'templates'
});

exports.select = (function () {
    var selectors = {
        medications: function (entry) {
            var status = entry.status;
            if (status === 'Completed') {
                return medication.medicationAdministration;
            }
            if (status === 'Prescribed') {
                return medication.medicationPrescription;
            }
            logger.error({
                entry: entry
            }, 'unsupported medication status: %s', status);
            return null;
        },
        allergies: function (entry) {
            if (!entry.observation) {
                logger.error({
                    entry: entry
                }, 'missing observation');
                return null;
            }
            if (entry.observation && entry.observation.negation_indicator) {
                logger.error({
                    entry: entry
                }, 'negated allergies are not supported');
                return null;
            }
            if (entry.observation && !entry.observation.allergen) {
                logger.error({
                    entry: entry
                }, 'missing allergen');
                return null;
            }
            return allergy.allergyIntolerance;
        },
        problems: function (entry) {
            if (!(entry.problem && entry.problem.code)) {
                logger.error({
                    entry: entry
                }, 'missing problem code');
                return null;
            }
            return problem.condition;
        },
        results: function (entry) {
            return result.observationPanel;
        },
        'results-single': function (entry) {
            return result.observationSingle;
        },
        vitals: function (entry) {
            if (!entry.vital) {
                logger.error({
                    entry: entry
                }, 'missing vital sign');
                return null;
            }
            return vital.observation;
        },
        demographics: function (entry) {
            return demographics;
        }
    };
    return function select(sectionName, entry) {
        var selector = selectors[sectionName];
        if (selector) {
            return selector(entry);
        } else {
            logger.error('unsupported section name: %s', sectionName);
            return null;
        }
    };
})();

exports.selectDemographics = function () {
    return demographics;
};

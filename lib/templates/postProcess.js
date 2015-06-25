"use strict";

var _ = require('lodash');

var rootLogger = require('../log');

var logger = rootLogger.child({
    module: 'postProcess'
});

exports.medicationPrescription = function (result) {
    var endDate = function endDate(medPrescription) {
        var timingSchedule = _.get(medPrescription, 'dosageInstruction.0.timingSchedule');
        if (timingSchedule != null) {
            var r = _.get(timingSchedule, 'repeat.end');
            if (r === null) {
                r = _.get(timingSchedule, 'event[0].end');
            }
            return r;
        } else {
            return null;
        }
    };

    if (result.status === 'active') {
        var ed = endDate(result);
        if (ed !== null) {
            ed = new Date(ed); //convert to Date
            logger.debug('MedicationPrescription has an end date: ' + ed);

            var currentDate = new Date();
            if (ed < currentDate) {
                logger.debug('MedicationPrescription:  end date before current date - setting status to completed!');
                result.status = 'completed';
            }
        }
    }

    return result;
};

exports.observationForLabResult = function (result, bundle) {
    if (result.code && result.related && result.related.length) {
        var n = result.related.length;
        if (n > 1) {
            return result;
        } else {
            var targetId = _.get(result, 'related.0.target.reference');
            if (targetId && bundle && bundle.count()) {
                for (var i = bundle.count() - 1; i >= 0; --i) {
                    var bundleResource = bundle.resource(i);
                    var id = bundle.id(i);
                    if (id === targetId) {
                        var relatedCode = _.get(bundleResource, 'code.coding.0.code');
                        var code = _.get(result, 'code.coding.0.code');
                        if (relatedCode === code) {
                            return null;
                        }
                    }
                }
                return result;
            }
        }
    }
    return null;
};

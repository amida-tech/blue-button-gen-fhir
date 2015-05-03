"use strict";

var rootLogger = require('../log');
var bbu = require('blue-button-util');

var logger = rootLogger.child({
    module: 'postProcess'
});

var bbuo = bbu.object;

exports.medicationPrescription = function (result) {
    var endDate = function endDate(medPrescription) {
        var timingSchedule = bbuo.deepValue(medPrescription, 'dosageInstruction.0.timingSchedule');
        if (timingSchedule != null) {
            var r = bbuo.deepValue(timingSchedule, 'repeat.end');
            if (r === null) {
                r = bbuo.deepValue(timingSchedule, 'event.0.end');
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
            var targetId = bbuo.deepValue(result, 'related.0.target.reference');
            if (targetId && bundle && bundle.count()) {
                for (var i = bundle.count() - 1; i >= 0; --i) {
                    var bundleResource = bundle.resource(i);
                    var id = bundle.id(i);
                    if (id === targetId) {
                        var relatedCode = bbuo.deepValue(bundleResource, 'code.coding.0.code');
                        var code = bbuo.deepValue(result, 'code.coding.0.code');
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

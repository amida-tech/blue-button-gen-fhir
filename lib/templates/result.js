"use strict";

var _ = require("lodash");

var value = require('./value');
var postProcess = require('./postProcess');

var referenceRange = exports.referenceRange = {
    content: {
        low: {
            value: value.quantity,
            dataTransform: function (input) {
                return {
                    value: input.low,
                    unit: input.unit
                };
            }
        },
        high: {
            value: value.quantity,
            dataTransform: function (input) {
                return {
                    value: input.high,
                    unit: input.unit
                };
            }
        },
        text: {
            dataKey: 'range'
        }
    },
    dataKey: 'reference_range',
    existsUnless: [_.negate(_.partialRight(_.has, 'reference_range.low')), _.negate(_.partialRight(_.has, 'reference_range.high')), _.negate(_.partialRight(_.has, 'reference_range.range'))]
};

var observation = exports.observation = {
    content: {
        resourceType: 'Observation',
        code: {
            value: value.codeableConcept,
            dataKey: 'result'
        },
        valueQuantity: {
            value: value.quantity
        },
        valueString: {
            dataKey: 'text',
            existsWhen: _.negate(_.partialRight(_.has, 'value'))
        },
        issued: {
            value: value.time,
            dataKey: ['date_time.point', 'date_time.low']
        },
        status: {
            value: value.conceptCodeMap('V3ResultStatusToObservationStatus'),
            dataKey: 'status'
        },
        reliability: 'ok',
        interpretation: {
            content: {
                coding: {
                    content: {
                        system: "http://hl7.org/fhir/v3/ObservationInterpretation",
                        code: value.interpretationCode,
                        display: _.identity
                    },
                    multiple: true
                },
                text: _.identity
            },
            dataKey: 'interpretations.0'
        },
        referenceRange: {
            value: referenceRange,
            multiple: true
        }
    },
    existsWhen: _.partialRight(_.has, 'result')
};

var observationSingle = exports.observationSingle = _.cloneDeep(observation);
delete observationSingle.existsWhen;
observationSingle.dataKey = 'results.0';

var observationPanel = exports.observationPanel = {
    content: {
        resourceType: 'Observation',
        code: {
            value: value.codeableConcept,
            dataKey: 'result_set'
        },
        status: 'final',
        reliability: 'ok',
        related: {
            content: {
                type: 'has-component',
                target: {
                    content: {
                        reference: {
                            external: observation
                        }
                    }
                }
            },
            dataKey: 'results'
        }
    },
    postProcess: postProcess.observationForLabResult
};

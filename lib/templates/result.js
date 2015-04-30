"use strict";

var _ = require("lodash");

var bbu = require('blue-button-util');

var value = require('./value');
var postProcess = require('./postProcess');

var predicate = bbu.predicate;

var referenceRange = exports.referenceRange = {
    content: {
        meaning: {
            constant: {
                "coding": [{
                    "system": "http://hl7.org/fhir/referencerange-meaning",
                    "code": "normal",
                    "display": "Normal Range"
                }],
                "text": "Normal Range"
            }
        },
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
    existsWhen: predicate.or([predicate.hasProperty('reference_range.low'), predicate.hasProperty('reference_range.high'), predicate.hasProperty('reference_range.range')])
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
            existsWhen: predicate.hasNoProperty('value')
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
                        system: "http://hl7.org/fhir/v2/0078",
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
    existsWhen: predicate.hasProperty('result')
};

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

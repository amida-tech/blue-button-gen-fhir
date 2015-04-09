"use strict";

var _ = require("lodash");

var bbu = require('blue-button-util');
var value = require('./value');

var predicate = bbu.predicate;

exports.observation = {
    content: {
        resourceType: 'Observation',
        name: {
            value: value.codeableConcept,
            dataKey: 'vital'
        },
        valueQuantity: {
            value: value.quantity
        },
        issued: {
            value: value.time,
            dataKey: ['date_time.point', 'date_time.low']
        },
        status: 'final',
        reliability: 'ok',
        extension: {
            constant: [{
                url: "http://amida.com/fhir/Profile/extensions#observation-type",
                valueCoding: {
                    code: "8716-3",
                    display: "Vital signs",
                    system: "http://loinc.org"
                }
            }]
        },
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
        }
    }
};

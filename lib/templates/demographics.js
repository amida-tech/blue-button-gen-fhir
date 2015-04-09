"use strict";

var bbu = require('blue-button-util');

var value = require('./value');
var dataTransform = require('./dataTransform');
var postProcess = require('./postProcess');

var predicate = bbu.predicate;
var jp = bbu.jsonpath.instance;

module.exports = {
    DTSU2: true,
    content: {
        resourceType: 'Patient',
        identifier: {
            content: {
                system: {
                    value: function (input) {
                        return "urn:oid:" + input;
                    },
                    dataKey: 'identifier'
                },
                value: {
                    dataKey: 'extension'
                }
            },
            dataKey: 'identifiers'
        },
        name: {
            content: {
                family: {
                    dataKey: 'last',
                    multiple: true
                },
                given: {
                    dataKey: 'given'
                }
            },
            dataKey: 'name',
            dataTransform: function (input) {
                return {
                    last: input.last,
                    given: [input.first].concat(input.middle)
                };
            }
        },
        telecom: {
            content: {
                system: 'phone',
                value: {
                    dataKey: 'number'
                },
                use: {
                    value: value.telecomUse,
                    dataKey: 'type'
                }
            },
            dataKey: 'phone'
        },
        gender: {
            value: value.nameToCodeableConcept("2.16.840.1.113883.5.1"),
            dataKey: 'gender'
        },
        birthdate: {
            value: value.date,
            dataKey: 'dob.point'
        },
        address: {
            content: {
                use: {
                    value: value.addressUse,
                    dataKey: "use"
                },
                line: {
                    dataKey: 'street_lines'
                },
                city: {
                    dataKey: 'city'
                },
                state: {
                    dataKey: 'state'
                },
                zip: {
                    dataKey: 'zip'
                },
                country: {
                    dataKey: "country"
                }
            },
            dataKey: "addresses"
        },
        maritalStatus: {
            value: value.nameToCodeableConcept("2.16.840.1.113883.5.2"),
            dataKey: 'marital_status'
        },
        extension: {
            arrayContent: [{
                value: value.nameToExtensionCodeableConcept("2.16.840.1.113883.5.1076", "http://hl7.org/fhir/StructureDefinition/us-core-religion", "http://hl7.org/fhir/v3/vs/ReligiousAffiliation"),
                dataKey: 'religion'
            }, {
                value: value.nameToExtensionCodeableConcept("2.16.840.1.113883.6.238", "http://hl7.org/fhir/Profile/us-core#race", "http://hl7.org/fhir/v3/Race"),
                dataKey: 'race'
            }, {
                value: value.nameToExtensionCodeableConcept("2.16.840.1.113883.6.238", "http://hl7.org/fhir/Profile/us-core#ethnicity", "http://hl7.org/fhir/v3/Ethnicity"),
                dataKey: 'ethnicity'
            }]
        }
    }
};

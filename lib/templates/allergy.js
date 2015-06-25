"use strict";

var _ = require('lodash');

var value = require('./value');

exports.allergyIntolerance = {
    content: {
        resourceType: 'AllergyIntolerance',
        criticality: {
            value: value.conceptCodeMap('V3ToCriticality'),
            dataKey: 'observation.severity.code.code'
        },
        recordedDate: {
            value: value.time,
            dataKey: 'date_time.low'
        },
        status: {
            value: value.conceptCodeMap('V3ToSensitivityStatus'),
            dataKey: 'observation.status.code'
        },
        substance: {
            value: value.codeableConcept,
            dataKey: 'observation.allergen'
        },
        event: {
            content: {
                manifestation: {
                    value: value.codeableConcept,
                    dataKey: 'reaction',
                    multiple: true
                },
                severity: {
                    value: value.conceptCodeMap('V3ToReactionSeverity'),
                    dataKey: 'severity.code.code',
                }
            },
            dataKey: 'observation.reactions'
        }
    },
    existsWhen: _.partialRight(_.has, 'observation.allergen')
};

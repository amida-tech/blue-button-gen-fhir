"use strict";

var bbu = require('blue-button-util');
var value = require('./value');

var predicate = bbu.predicate;

var substance = {
    content: {
        resourceType: 'Substance',
        type: {
            value: value.codeableConcept,
            dataKey: 'observation.allergen'
        }
    }
};

var adverseReaction = {
    content: {
        resourceType: 'AdverseReaction',
        symptom: {
            content: {
                severity: {
                    value: value.conceptCodeMap('V3ToReactionSeverity'),
                    dataKey: 'severity.code.code',
                },
                code: {
                    value: value.codeableConcept,
                    dataKey: 'reaction'
                }
            },
            multiple: true
        },
        didNotOccurFlag: false // todo
    },
    existsWhen: predicate.hasProperty('reaction')
};

exports.allergyIntolerance = {
    content: {
        resourceType: 'AllergyIntolerance',
        criticality: {
            value: value.conceptCodeMap('V3ToCriticality'),
            dataKey: 'observation.severity.code.code'
        },
        sensitivityType: 'allergy',
        recordedDate: {
            value: value.time,
            dataKey: 'date_time.low'
        },
        status: {
            value: value.conceptCodeMap('V3ToSensitivityStatus'),
            dataKey: 'observation.status.code'
        },
        contained: {
            assign: [{
                content: {
                    id: 'allergen'
                }
            }, substance],
            multiple: true
        },
        substance: {
            content: {
                reference: '#allergen',
                display: {
                    dataKey: 'observation.allergen.name'
                }
            }
        },
        reaction: {
            content: {
                reference: {
                    external: adverseReaction,
                },
                display: {
                    dataKey: 'reaction.name'
                }
            },
            dataKey: 'observation.reactions'
        }
    },
    existsWhen: predicate.hasProperty('observation.allergen.code')
};

"use strict";

var bbu = require('blue-button-util');
var value = require('./value');

var predicate = bbu.predicate;

exports.condition = {
    content: {
        resourceType: 'Condition',
        status: 'confirmed',
        onsetDate: {
            value: value.date,
            dataKey: 'problem.date_time.low'
        },
        dateAsserted: {
            value: value.date,
            dataKey: 'problem.date_time.low'
        },
        abatementDate: {
            value: value.date,
            dataKey: 'problem.date_time.high'
        },
        abatementBoolean: {
            value: value.inValueSet(['Resolved', 'Inactive']),
            dataKey: 'status.name',
            existsWhen: predicate.hasNoProperty('problem.date_time.high')
        },
        code: {
            value: value.codeableConcept,
            dataKey: 'problem.code'
        }
    }
};

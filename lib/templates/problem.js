"use strict";

var _ = require('lodash');

var value = require('./value');

exports.condition = {
    content: {
        resourceType: 'Condition',
        clinicalStatus: 'confirmed',
        onsetDateTime: {
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
            existsWhen: _.negate(_.partialRight(_.has, 'problem.date_time.high'))
        },
        code: {
            value: value.codeableConcept,
            dataKey: 'problem.code'
        }
    }
};

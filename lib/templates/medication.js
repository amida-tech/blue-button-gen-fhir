"use strict";

var bbu = require('blue-button-util');

var value = require('./value');
var dataTransform = require('./dataTransform');
var postProcess = require('./postProcess');

var predicate = bbu.predicate;

/**
 * Dosage variants:
 *
 * 1. ONCE: dreMedication.date_time.point.date, no dreMedication.administration.interval
 *      CCDA sample: <effectiveTime xsi:type='TS' value='200509010118'/>
 *
 * 2. INTERVAL with no frequency information:
 *      CCDA sample:
 *            <effectiveTime xsi:type="IVL_TS">
 *               <low value="20120806"/>
 *               <high value="20120813"/>
 *            </effectiveTime>
 *
 * 3. INTERVAL with FREQUENCY (PIVL_TS):
 *      CCDA sample:
 *            <effectiveTime xsi:type="IVL_TS">
 *               <low value="20120806"/>
 *               <high value="20120813"/>
 *            </effectiveTime>
 *            <effectiveTime xsi:type="PIVL_TS" institutionSpecified="true" operator="A">
 *               <period value="12" unit="h"/>
 *            </effectiveTime>
 *
 * 4. INTERVAL with EVENT (EIVL_TS):
 *      CCDA sample:
 *            <effectiveTime xsi:type="IVL_TS">
 *               <low value="20121101"/>
 *               <high value="20121231"/>
 *            </effectiveTime>
 *            <effectiveTime xsi:type="EIVL_TS" operator="A">
 *               <event code="HS"/>
 *            </effectiveTime>
 *
 */

// Variant 3
var scheduleRepeatFrequency = exports.scheduleRepeatFrequency = {
    content: {
        frequency: {
            value: 1
        },
        duration: {
            dataKey: 'administration.interval.period.value',
            default: 1
        },
        durationUnits: {
            value: value.unit,
            dataKey: 'administration.interval.period.unit',
            default: 's'
        },
        'bounds.end': {
            value: value.time,
            dataKey: 'date_time.high'
        }
    },
    existsWhen: predicate.hasProperty('administration.interval.period.value'),
};

// Variant 4
var scheduleRepeatWhen = exports.scheduleRepeatWhen = {
    content: {
        when: {
            value: value.timingEvent,
            dataKey: 'administration.interval.event'
        },
        'bounds.end': {
            value: value.time,
            dataKey: 'date_time.high'
        },
        duration: 1,
        durationUnits: 's'
    },
    existsWhen: predicate.hasProperty('administration.interval.event'),
};

var schedule = exports.schedule = {
    content: {
        event: {
            content: {
                start: {
                    value: value.time,
                }
            },
            dataKey: 'date_time.low',
            multiple: true
        },
        repeat: {
            firstOf: [scheduleRepeatWhen, scheduleRepeatFrequency]
        }
    }
};

//"rate" - not implemented
//"method" - not implemented
//"maxDosePerPeriod" - not implemented
//CCDA administrationUnitCode ?
var dosageInstruction = exports.dosageInstruction = {
    content: {
        site: {
            value: value.codeableConcept,
            dataKey: 'administration.site'
        },
        route: {
            value: value.codeableConcept,
            dataKey: 'administration.route'
        },
        doseQuantity: {
            value: value.quantity,
            dataKey: 'administration.dose'
        },
        scheduledDateTime: {
            value: value.time,
            dataKey: 'date_time.point',
            existsWhen: predicate.hasNoProperty('administration.interval')
        },
        scheduledPeriod: {
            content: {
                start: {
                    value: value.time,
                    dataKey: 'date_time.low'
                },
                end: {
                    value: value.time,
                    dataKey: 'date_time.high'
                }
            },
            existsWhen: predicate.hasNoProperties(['administration.interval', 'date_time.point'])
        },
        scheduledTiming: {
            value: schedule,
            existsWhen: predicate.hasProperty('administration.interval')
        },
        asNeededCodeableConcept: {
            value: value.codeableConcept,
            dataKey: 'precondition.value'
        },
        asNeededBoolean: {
            value: true,
            existsWhen: predicate.and([predicate.hasProperty('precondition'), predicate.falsyPropertyValue('precondition.value')])
        }
    }
};

//"rate" - not implemented
//"method" - not implemented
//"maxDosePerPeriod" - not implemented
//CCDA administrationUnitCode ?
var dosage = exports.dosage = {
    content: {
        site: {
            value: value.codeableConcept,
            dataKey: 'administration.site'
        },
        route: {
            value: value.codeableConcept,
            dataKey: 'administration.route'
        },
        quantity: {
            value: value.quantity,
            dataKey: 'administration.dose'
        }
    }
};

var medication = exports.medication = {
    content: {
        resourceType: 'Medication',
        name: {
            dataKey: ['product.unencoded_name', 'product.product.name']
        },
        code: {
            value: value.codeableConcept,
            dataKey: 'product.product'
        }
    },
    existsWhen: predicate.hasProperty('product.product'),
    dataTransform: dataTransform.rxNormOnly
};

var medicationPrescription = exports.medicationPrescription = {
    content: {
        resourceType: 'MedicationPrescription',
        status: 'active',
        dateWritten: {
            value: value.time,
            dataKey: ['date_time.point', 'date_time.low']
        },
        dosageInstruction: {
            value: dosageInstruction,
            multiple: true
        },
        text: {
            content: {
                status: 'generated',
                div: {
                    dataKey: 'sig'
                }
            },
            existsWhen: predicate.hasProperty('sig')
        },
        contained: {
            assign: [{
                content: {
                    id: 'med'
                }
            }, medication],
            multiple: true,
            existsWhen: predicate.hasProperty('product.product'),
        },
        medication: {
            content: {
                reference: '#med',
                display: {
                    dataKey: ['product.unencoded_name', 'product.product.name']
                }
            },
            existsWhen: predicate.hasProperty('product.product')
        }
    },
    postProcess: postProcess.medicationPrescription
};

exports.medicationAdministration = {
    content: {
        resourceType: 'MedicationAdministration',
        status: 'completed',
        dosage: {
            value: dosage
        },
        prescription: {
            content: {
                reference: {
                    external: medicationPrescription
                },
                display: {
                    dataKey: 'sig'
                }
            }
        },
        effectiveTimeDateTime: {
            value: value.time,
            dataKey: 'date_time.point'
        },
        effectiveTimePeriod: {
            content: {
                start: {
                    value: value.time,
                    dataKey: 'date_time.low'
                },
                end: {
                    value: value.time,
                    dataKey: 'date_time.high'
                }
            },
            existsWhen: predicate.hasNoProperty('date_time.point')
        },
        contained: {
            assign: [{
                content: {
                    id: 'med'
                }
            }, medication],
            multiple: true,
            existsWhen: predicate.hasProperty('product.product'),
        },
        medication: {
            content: {
                reference: '#med',
                display: {
                    dataKey: ['product.unencoded_name', 'product.product.name']
                }
            },
            existsWhen: predicate.hasProperty('product.product')
        }
    }
};

var statementDosage = exports.stetementDosage = {
    content: {
        site: {
            value: value.codeableConcept,
            dataKey: 'administration.site'
        },
        route: {
            value: value.codeableConcept,
            dataKey: 'administration.route'
        },
        quantity: {
            value: value.quantity,
            dataKey: 'administration.dose'
        },
        asNeededCodeableConcept: {
            value: value.valueCodeableConcept,
            dataKey: 'precondition.value'
        },
        'schedule.repeat': {
            firstOf: [{
                content: {
                    when: {
                        value: value.timingEvent,
                        dataKey: 'administration.interval.event'
                    }
                }
            }, {
                content: {
                    period: {
                        dataKey: 'administration.interval.period.value',
                    },
                    periodUnits: {
                        value: value.unit,
                        dataKey: 'administration.interval.period.unit'
                    },
                },
                existsWhen: predicate.hasProperty('administration.interval.period.value')
            }]
        }
    }
};

var medicationForStatement = exports.medication = {
    content: {
        resourceType: 'Medication',
        name: {
            dataKey: ['product.unencoded_name', 'product.product.name']
        },
        code: {
            value: value.codeableConcept,
            dataKey: 'product.product'
        }
    },
    existsWhen: predicate.hasProperty('product.product')
};

exports.medicationStatement = {
    content: {
        resourceType: 'MedicationStatement',
        status: {
            value: function (input) {
                return input === 'Completed' ? 'completed' : 'in-progress';
            },
            dataKey: 'status'
        },
        dosage: {
            value: statementDosage,
            multiple: true
        },
        effectiveTimeDateTime: {
            value: value.time,
            dataKey: 'date_time.point'
        },
        effectivePeriod: {
            content: {
                start: {
                    value: value.time,
                    dataKey: 'date_time.low'
                },
                end: {
                    value: value.time,
                    dataKey: 'date_time.high'
                }
            },
            existsWhen: predicate.hasNoProperty('date_time.point')
        },
        contained: {
            assign: [{
                content: {
                    id: 'med'
                }
            }, medicationForStatement],
            multiple: true,
            existsWhen: predicate.hasProperty('product.product'),
        },
        medication: {
            content: {
                reference: '#med',
                display: {
                    dataKey: ['product.unencoded_name', 'product.product.name']
                }
            },
            existsWhen: predicate.hasProperty('product.product')
        }
    }
};

"use strict";

var bbu = require("blue-button-util");
var bbm = require("blue-button-meta");

var conceptMapper = require('./conceptMapper');
var rootLogger = require('../log');

var logger = rootLogger.child({
    module: 'templates.value'
});

var datetime = bbu.datetime;
var code_systems = bbm.code_systems;

exports.codeableConcept = (function () {
    var systemMap = {
        "rxnorm": "http://www.nlm.nih.gov/research/umls/rxnorm",
        "snomed ct": "http://snomed.info/sct",
        "loinc": "http://loinc.org",
        "medication route fda": "urn:oid:2.16.840.1.113883.3.26.1.1",
        "unii": "http://fdasis.nlm.nih.gov"
    };

    var translateSystem = function (code_system_name) {
        logger.trace('in value.codeableConcept.translateSystem');
        if (code_system_name) {
            var lcsn = code_system_name.toLowerCase();
            var result = systemMap[lcsn];
            if (!result) {
                var oid = code_systems.findFromName(code_system_name);
                if (oid) {
                    result = "urn:oid:" + oid;
                }
            }
            if (!result) {
                logger.error('missing code system name: %s', code_system_name);
            }
            return result;
        } else {
            return null;
        }
    };

    var coding = exports.coding = function (input) {
        return {
            system: translateSystem(input.code_system_name),
            code: input.code,
            display: input.name
        };
    };

    return function (input) {
        if (input.name || input.code) {
            var result = {};
            if (input.code) {
                result.coding = [coding(input)];
            }
            result.text = input.name;
            return result;
        } else {
            return null;
        }
    };
})();

exports.time = datetime.modelToDateTime;

exports.date = datetime.modelToDate;

exports.conceptCodeMap = function (type) {
    return function (input) {
        return conceptMapper.translateConceptToCode(input, type);
    };
};

exports.unit = function (input) {
    if (input !== '1') {
        return input;
    } else {
        return null;
    }
};

exports.quantity = function (input) {
    if (input.value === undefined || input.value === null) {
        return null;
    } else {
        var v = input.value;
        var u = exports.unit(input.unit);
        var q = {
            value: parseFloat(v)
        };
        if (u) {
            q.units = u;
            q.code = u;
            q.system = "http://unitsofmeasure.org";
        }
        return q;
    }
};

exports.interpretationCode = (function () {
    var map = {
        "better": "B",
        "decreased": "D",
        "increased": "U",
        "worse": "W",
        "low off scale": "<",
        "high off scale": ">",
        "abnormal": "A",
        "abnormal alert": "AA",
        "high": "H",
        "high alert": "HH",
        "low": "L",
        "low alert": "LL",
        "normal": "N",
        "intermediate": "I",
        "moderately susceptible": "MS",
        "resistent": "R",
        "susceptible": "S",
        "very susceptible": "VS",
        "outside threshold": "EX",
        "above high threshold": "HX",
        "below low threshold": "LX"
    };

    return function (input) {
        if (input) {
            input = input.toLowerCase();
            var result = map[input];
            if (result === undefined) {
                result = null;
            }
            return result;
        } else {
            return null;
        }
    };
})();

exports.timingEvent = (function () {
    var map = {
        "before meal": "AC",
        "before lunch": "ACD",
        "before breakfast": "ACM",
        "before dinner": "ACV",
        "with meal": "C", //not in FHIR
        "with lunch": "CD", //not in FHIR
        "with breakfast": "CM", //not in FHIR
        "with dinner": "CV", //not in FHIR
        "at bedtime": "HS",
        "between meals": "IC", //not in FHIR
        "between lunch and dinner": "ICD", //not in FHIR
        "between breakfast and lunch": "ICM", //not in FHIR
        "between dinner and bedtime": "ICV", //not in FHIR
        "after meal": "PC",
        "after lunch": "PCD",
        "after breakfast": "PCM",
        "after dinner": "PCV",
        "upon waking": "WAKE"
    };

    return function (input) {
        if (input) {
            input = input.toLowerCase();
            var result = map[input];
            if (result === undefined) {
                result = null;
            }
            return result;
        } else {
            return null;
        }
    };
})();

exports.inValueSet = function (valueSet) {
    return function (input) {
        if (valueSet.indexOf(input) >= 0) {
            return true;
        } else {
            return null;
        }
    };
};

exports.telecomUse = (function () {
    var map = {
        "primary home": "home",
        "work place": "work",
        "mobile contact": "mobile"
    };

    return function (input) {
        return map[input];
    };
})();

exports.addressUse = (function () {
    var map = {
        "primary home": "home",
        "home address": "home",
        "work place": "work",
        "temporary": "temp",
        "bad address": "old"
    };

    return function (input) {
        return map[input];
    };
})();

exports.nameToCodeableConcept = (function () {
    var systemMap = {
        "2.16.840.1.113883.5.1": "http://hl7.org/fhir/v3/AdministrativeGender",
        "2.16.840.1.113883.5.2": "http://hl7.org/fhir/v3/MaritalStatus"
    };

    return function (oid) {
        var cs = code_systems.find(oid);

        return function (input) {
            var result = {};
            if (input) {
                result.coding = [{
                    system: systemMap[oid],
                    code: cs.displayNameCode(input),
                    display: input
                }];
            }
            result.text = input;
            return result;
        };
    };
})();

exports.nameToExtensionCodeableConcept = (function () {
    return function (oid, url, system) {
        var cs = code_systems.find(oid);

        return function (input) {
            var result = {
                url: url
            };
            if (input) {
                result.valueCodeableConcept = {
                    coding: [{
                        system: system,
                        code: cs.displayNameCode(input),
                        display: input
                    }]
                };
            }
            return result;
        };
    };
})();

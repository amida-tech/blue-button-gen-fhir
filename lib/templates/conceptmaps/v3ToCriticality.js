"use strict";

module.exports = {
    "resourceType": "ConceptMap",
    "name": "V3ToCriticality",
    "description": "Mapping from ProblemSeverity (SNOMED CT) to Criticality",
    "status": "draft",
    "concept": [{
        "system": "http://snomed.info/sct",
        "code": "399166001",
        "map": [{
            "system": "http://hl7.org/fhir/criticality",
            "code": "fatal",
            "equivalence": "equal"
        }]
    }, {
        "system": "http://snomed.info/sct",
        "code": "24484000",
        "map": [{
            "system": "http://hl7.org/fhir/criticality",
            "code": "high",
            "equivalence": "equal"
        }]
    }, {
        "system": "http://snomed.info/sct",
        "code": "371924009",
        "map": [{
            "system": "http://hl7.org/fhir/criticality",
            "code": "medium",
            "equivalence": "equal"
        }]
    }, {
        "system": "http://snomed.info/sct",
        "code": "6736007",
        "map": [{
            "system": "http://hl7.org/fhir/criticality",
            "code": "medium",
            "equivalence": "equal"
        }]
    }, {
        "system": "http://snomed.info/sct",
        "code": "371923003",
        "map": [{
            "system": "http://hl7.org/fhir/criticality",
            "code": "low",
            "equivalence": "equal"
        }]
    }, {
        "system": "http://snomed.info/sct",
        "code": "255604002",
        "map": [{
            "system": "http://hl7.org/fhir/criticality",
            "code": "low",
            "equivalence": "equal"
        }]
    }]
};

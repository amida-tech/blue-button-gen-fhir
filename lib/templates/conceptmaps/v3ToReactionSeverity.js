"use strict";

module.exports = {
    "resourceType": "ConceptMap",
    "name": "V3ToReactionSeverity",
    "description": "Mapping from ProblemSeverity To FHIR ReactionSeverity",
    "status": "draft",
    "concept": [{
        "system": "http://snomed.info/sct",
        "code": "399166001",
        "map": [{
            "system": "http://hl7.org/fhir/reactionSeverity",
            "code": "severe",
            "equivalence": "equal"
        }]
    }, {
        "system": "http://snomed.info/sct",
        "code": "24484000",
        "map": [{
            "system": "http://hl7.org/fhir/reactionSeverity",
            "code": "severe",
            "equivalence": "equal"
        }]
    }, {
        "system": "http://snomed.info/sct",
        "code": "371924009",
        "map": [{
            "system": "http://hl7.org/fhir/reactionSeverity",
            "code": "serious",
            "equivalence": "equivalent"
        }]
    }, {
        "system": "http://snomed.info/sct",
        "code": "6736007",
        "map": [{
            "system": "http://hl7.org/fhir/reactionSeverity",
            "code": "moderate",
            "equivalence": "equal"
        }]
    }, {
        "system": "http://snomed.info/sct",
        "code": "371923003",
        "map": [{
            "system": "http://hl7.org/fhir/reactionSeverity",
            "code": "minor",
            "equivalence": "equal"
        }]
    }, {
        "system": "http://snomed.info/sct",
        "code": "255604002",
        "map": [{
            "system": "http://hl7.org/fhir/reactionSeverity",
            "code": "minor",
            "equivalence": "equal"
        }]
    }]
};

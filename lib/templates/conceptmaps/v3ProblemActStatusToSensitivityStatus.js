"use strict";

module.exports = {
    "resourceType": "ConceptMap",
    "name": "V3ProblemActStatusToSensitivityStatus",
    "description": "Mapping from ProblemActStatusCode to FHIR SensitivityStatus",
    "status": "draft",
    "concept": [{
        "system": "http://hl7.org/fhir/v3/ActStatus",
        "code": "active",
        "map": [{
            "system": "http://hl7.org/fhir/sensitivitystatus",
            "code": "confirmed",
            "equivalence": "equal"
        }]
    }, {
        "system": "http://hl7.org/fhir/v3/ActStatus",
        "code": "completed",
        "map": [{
            "system": "http://hl7.org/fhir/sensitivitystatus",
            "code": "resolved",
            "equivalence": "equal"
        }]
    }]
};

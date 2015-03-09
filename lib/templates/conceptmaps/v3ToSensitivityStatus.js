"use strict";

module.exports = {
    "resourceType": "ConceptMap",
    "name": "V3ToSensitivityStatus",
    "description": "Mapping from HITSP Problems Status to FHIR SensitivityStatus",
    "status": "draft",
    "concept": [{
        "system": "http://snomed.info/sct",
        "code": "55561003",
        "map": [{
            "system": "http://hl7.org/fhir/sensitivitystatus",
            "code": "confirmed",
            "equivalence": "equal"
        }]
    }, {

        "system": "http://snomed.info/sct",
        "code": "413322009",
        "map": [{
            "system": "http://hl7.org/fhir/sensitivitystatus",
            "code": "resolved",
            "equivalence": "equal"
        }]
    }, {

        "system": "http://snomed.info/sct",
        "code": "73425007",
        "map": [{
            "system": "http://hl7.org/fhir/sensitivitystatus",
            "code": "resolved",
            "equivalence": "equivalent"
        }]
    }]
};

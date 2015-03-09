"use strict";

module.exports = {
    "resourceType": "ConceptMap",
    "name": "V3ResultStatusToObservationStatus",
    "description": "Mapping from ResultStatus To FHIR ObservationStatus",
    "status": "draft",
    "concept": [{
        "system": "http://hl7.org/fhir/v3/ActStatus",
        "code": "active",
        "map": [{
            "system": "http://hl7.org/fhir/observation-status",
            "code": "preliminary",
            "equivalence": "equivalent"
        }]
    }, {
        "system": "http://hl7.org/fhir/v3/ActStatus",
        "code": "aborted",
        "map": [{
            "system": "http://hl7.org/fhir/observation-status",
            "code": "cancelled",
            "equivalence": "equivalent"
        }]
    }, {
        "system": "http://hl7.org/fhir/v3/ActStatus",
        "code": "cancelled",
        "map": [{
            "system": "http://hl7.org/fhir/observation-status",
            "code": "cancelled",
            "equivalence": "equivalent"
        }]
    }, {
        "system": "http://hl7.org/fhir/v3/ActStatus",
        "code": "completed",
        "map": [{
            "system": "http://hl7.org/fhir/observation-status",
            "code": "final",
            "equivalence": "equivalent"
        }]
    }, {
        "system": "http://hl7.org/fhir/v3/ActStatus",
        "code": "held",
        "map": [{
            "system": "http://hl7.org/fhir/observation-status",
            "code": "preliminary",
            "equivalence": "equivalent"
        }]
    }, {
        "system": "http://hl7.org/fhir/v3/ActStatus",
        "code": "suspended",
        "map": [{
            "system": "http://hl7.org/fhir/observation-status",
            "code": "preliminary",
            "equivalence": "equivalent"
        }]
    }]
};

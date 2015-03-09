"use strict";

var _ = require('lodash');

var conceptMaps = require('./conceptmaps');

var log = require('../log.js').child({
    module: 'conceptMapper'
});

var cache = conceptMaps.reduce(function (r, conceptMap) {
    r[conceptMap.name] = _.map(conceptMap.concept, function (cm) {
        return {
            'source': {
                'system': cm.system,
                'code': cm.code
            },
            'target': {
                'system': cm.map[0].system,
                'code': cm.map[0].code
            }
        };
    });
    return r;
}, {});

function findCacheEntry(cacheMapping, code, system) {
    return _.find(cacheMapping, function (mapping) {
        return mapping.source.code === code && (!system || mapping.source.system === system);
    });
}

/** Translate a concept from a valueset to another using the cached translations
 *
 * concept can be:
 * - a FHIR code (i.e. string)
 * - a FHIR CodeableConcept
 *
 * returns a FHIR Coding
 **/
var translateConcept = module.exports.translateConcept = function (concept, mapName) {
    if (!concept) {
        return null;
    }

    var code, system;
    if (_.isString(concept)) { //FHIR code
        code = concept;
        system = null;
    } else if (concept.coding) { //FHIR CodeableConcept
        code = concept.coding[0].code;
        system = concept.coding[0].system;
    }

    var pair = findCacheEntry(cache[mapName], code, system);
    if (pair) {
        return pair.target;
    } else {
        return null;
    }

    log.warn('Could not map concept: \n' + JSON.stringify(concept, undefined, 4) + '\n withing mapping ' + mapName);
};

/**
 * Translate FHIR Concept to HL7 CD and extract the code (string). The FHIR Concept can be a FHIR code (string) or a FHIR CodeableConcept
 * @param  {object} concept
 * @param  {string} mapName
 * @return {string}
 */
exports.translateConceptToCode = function (concept, mapName) {
    var mappedConcept = translateConcept(concept, mapName);
    if (!mappedConcept) {
        return null;
    } else {
        return mappedConcept.code;
    }
};

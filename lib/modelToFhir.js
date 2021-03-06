"use strict";

var bb = require("blue-button");
var _ = require('lodash');

var logger = require('./log');
var json2json = require('./json2json');
var bundler = require('./bundler');
var templates = require('./templates');

var sectionPostProcess = require('./sectionPostProcess');

var log = logger.child({
    module: 'ccda2fhir'
});

var entryToResource = exports.entryToResource = function (sectionKey, entry) {
    log.trace({
        entry: entry
    }, 'entered ' + sectionKey + ' entry translation');
    if (sectionKey === 'results') {
        sectionKey = 'results-single';
    }
    var template = templates.select(sectionKey, entry);
    if (template) {
        var bundle = bundler.instance();
        var json2jsonInstance = json2json.instance(bundle);
        var resource = json2jsonInstance.run(template, entry);

        if (!resource) {
            logger.info({
                entry: entry
            }, sectionKey + ' entry is ignored');
        }
        return resource;
    } else {
        return null;
    }
};

var entryToBundle = exports.entryToBundle = function (sectionKey, entry) {
    log.trace({
        entry: entry
    }, 'entered ' + sectionKey + ' entry translation');
    var template = templates.select(sectionKey, entry);
    if (template) {
        var bundle = bundler.instance();
        var json2jsonInstance = json2json.instance(bundle);
        var resource = json2jsonInstance.update(template, entry);
        if (!resource) {
            logger.info({
                entry: entry
            }, sectionKey + ' entry is ignored');
        }
        return bundle;
    } else {
        return null;
    }
};

var demographicsToBundle = exports.demographicsToBundle = function (demographics) {
    var template = templates.selectDemographics();
    if (template) {
        var bundle = bundler.instance();
        var json2jsonInstance = json2json.instance(bundle);
        var resource = json2jsonInstance.update(template, demographics);
        if (!resource) {
            logger.info({
                demographics: demographics
            }, 'demographics is ignored');
        }
        return bundle;
    } else {
        return null;
    }
};

var sectionToBundle = exports.sectionToBundle = function (sectionKey, section) {
    var bundle = bundler.instance();
    section.forEach(function (entry) {
        var entryBundle = entryToBundle(sectionKey, entry);
        if (entryBundle !== null) {
            bundle.addBundle(entryBundle);
        }
    });
    var pp = sectionPostProcess[sectionKey];
    if (pp) {
        pp(bundle);
    }
    return bundle;
};

var modelToFHIR = exports.modelToFHIR = function (model, options) {
    log.trace('start translation...');

    options = options || {};
    var data = model.data;
    var bundle = bundler.instance();

    var patientEntry = options.patientEntry;
    if (patientEntry) {
        patientEntry = _.cloneDeep(patientEntry);
    }
    if (!patientEntry && data.demographics) {
        var demographicsBundle = demographicsToBundle(data.demographics);
        patientEntry = demographicsBundle.entry[0];
    }
    if (patientEntry) {
        bundle.addEntry(patientEntry);
    }

    ['allergies', 'vitals', 'problems', 'results', 'medications'].forEach(function (sectionName) {
        var section = data[sectionName];
        if (section) {
            var sectionKey = options && options.sectionKeys && options.sectionKeys[sectionName];
            if (!sectionKey) {
                sectionKey = sectionName;
            }
            var sectionBundle = sectionToBundle(sectionKey, section);
            bundle.addBundle(sectionBundle);
        }
    });
    bundle.translateEntry();
    if (patientEntry && patientEntry.resource) {
        var name = patientEntry.resource && patientEntry.resource.name && patientEntry.resource.name[0];
        var family = (name && name.family) || [];
        var given = (name && name.given) || [];
        var patient = {
            reference: patientEntry.resource.id,
            display: family.join(' ') + ', ' + given.join(' ')
        };
        bundle.updatePatient(patient);
    }
    if (options.externalize) {
        bundle.externalize();
    }
    return bundle.toResource();
};

exports.contentToFHIR = function (content, options) {
    log.trace('start parsing content...');
    var model = bb.parse(content);
    if (!model) {
        return [];
    }

    if (model.errors) {
        log.warn({
            ccdaErrors: model.errors
        }, 'BB JSON model parse errors');
    }
    log.debug({
        bbModel: model
    });
    log.trace('parsed content...');

    return modelToFHIR(model, options);
};

"use strict";

var modelToFhir = require('./lib/modelToFhir');
var resourceUtil = require('./lib/resourceUtil');

exports.entryToFHIR = modelToFhir.entryToBundle;

exports.demographicsToFHIR = modelToFhir.demographicsToBundle;

exports.sectionToFHIR = modelToFhir.sectionToBundle;

exports.modelToFHIR = modelToFhir.modelToFHIR;

exports.contentToFHIR = modelToFhir.contentToFHIR;

exports.countResources = resourceUtil.countResources;

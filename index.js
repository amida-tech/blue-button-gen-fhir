"use strict";

var modelToFhir = require('./lib/modelToFhir');
var resourceUtil = require('./lib/resourceUtil');

exports.entryToResource = modelToFhir.entryToResource;

exports.entryToFHIR = modelToFhir.entryToBundle;

exports.demographicsToFHIR = modelToFhir.demographicsToBundle;

exports.sectionToFHIR = modelToFhir.sectionToBundle;

exports.modelToFHIR = modelToFhir.modelToFHIR;

exports.contentToFHIR = modelToFhir.contentToFHIR;

exports.countResources = resourceUtil.countResources;

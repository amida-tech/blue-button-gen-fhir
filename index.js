"use strict";

var modelToFhir = require('./lib/modelToFhir');
var resourceUtil = require('./lib/resourceUtil');

exports.modelToFHIR = modelToFhir.modelToFHIR;

exports.contentToFHIR = modelToFhir.contentToFHIR;

exports.countResources = resourceUtil.countResources;

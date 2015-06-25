"use strict";

var uuid = require("node-uuid");
var bbu = require("blue-button-util");
var _ = require("lodash");

var rootLogger = require('./log');
var logger = rootLogger.child({
    module: 'bundle'
});

var objectset = bbu.objectset;

var auxExternalizeContained = function (resource, options) {
    if (resource) {
        var refProperty = options.refProperty;
        var reference = resource[refProperty] && resource[refProperty].reference;
        if (reference && (reference[0] === '#')) {
            var id = reference.substring(1);
            var contained = resource.contained;
            if (contained) {
                var containedIndex = -1;
                for (var i = 0; i < contained.length; ++i) {
                    if (id === contained[i].id) {
                        containedIndex = i;
                        break;
                    }
                }
                if (containedIndex >= 0) {
                    var newId = options.resourceType + '/' + uuid.v4();
                    var newRefProperty = _.cloneDeep(resource[refProperty]);
                    newRefProperty.reference = newId;
                    resource[refProperty] = newRefProperty;
                    var newBundleEntry = _.cloneDeep(resource.contained[containedIndex]);
                    delete newBundleEntry.id;
                    var newResource = {
                        resource: _.assign({
                            id: newId
                        }, newBundleEntry)
                    };
                    resource.contained.splice(containedIndex, 1);
                    if (resource.contained.length === 0) {
                        delete resource.contained;
                    }
                    return newResource;
                }
            }
        }
    }
    return null;
};

var bundlePrototype = {
    addResource: function (resource) {
        logger.trace('in addResource');
        if (resource && resource.resourceType) {
            objectset.compact(resource);
            var id = uuid.v4();
            var bundleEntryResource = _.assign({
                id: resource.resourceType + '/' + uuid.v4()
            }, resource);
            var bundleEntry = {
                resource: bundleEntryResource
            };
            this.entry.push(bundleEntry);
            logger.debug({
                bundleEntry: bundleEntry
            }, 'added bundle entry %s', id);
            return bundleEntry;
        } else {
            logger.error({
                resource: resource
            }, 'attempt to add empty or typeless resource');
            return null;
        }
    },
    addBundle: function (bundle) {
        Array.prototype.push.apply(this.entry, bundle.entry);
    },
    addEntry: function (entry) {
        this.entry.push(entry);
    },
    id: function (index) {
        return this.entry[index].resource.id;
    },
    resource: function (index) {
        return this.entry[index].resource;
    },
    count: function () {
        return this.entry.length;
    },
    lastId: function () {
        return this.id(this.entry.length - 1);
    },
    updatePatient: (function () {
        var propertyPerResourceType = {
            AllergyIntolerance: 'patient',
            MedicationPrescription: 'patient',
            MedicationAdministration: 'patient',
            Condition: 'patient',
            Observation: 'subject'
        };

        return function (patientReference) {
            this.entry.forEach(function (entry) {
                var resource = entry && entry.resource;
                if (resource) {
                    var type = resource.resourceType;
                    var property = propertyPerResourceType[type];
                    if (property) {
                        resource[property] = patientReference;
                    }
                }
            });
        };
    })(),
    externalize: function () {
        this.entry.forEach(function (bundleEntry) {
            var resource = bundleEntry.resource;
            if (resource) {
                var type = resource.resourceType;
                var newBundleEntry;
                if (type === 'AllergyIntolerance') {
                    newBundleEntry = auxExternalizeContained(resource, {
                        refProperty: 'substance',
                        containedProperty: 'type',
                        resourceType: 'Substance',
                        displayProperty: 'text'
                    });
                    if (newBundleEntry !== null) {
                        this.entry.push(newBundleEntry);
                    }
                } else if ((type === 'MedicationPrescription') || (type === 'MedicationAdministration')) {
                    newBundleEntry = auxExternalizeContained(resource, {
                        refProperty: 'medication',
                        containedProperty: 'code',
                        resourceType: 'Medication',
                        displayProperty: 'display'
                    });
                    if (newBundleEntry !== null) {
                        this.entry.push(newBundleEntry);
                    }
                }
            }
        }, this);
    },
    translateEntry: function () {
        this.entry = this.entry.map(function (entry) {
            if (entry.resource) {
                return entry;
            } else {
                return {
                    resource: _.assign({
                        id: entry.id
                    }, entry.content)
                };
            }
        });
    },
    toResource: function () {
        return {
            resourceType: "Bundle",
            total: this.entry.length,
            entry: this.entry
        };
    }
};

exports.instance = function () {
    logger.trace('in instance');
    var result = Object.create(bundlePrototype);
    result.entry = [];
    return result;
};

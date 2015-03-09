"use strict";

exports.countResources = function (bundle, typesOfInterest) {
    if (!typesOfInterest) {
        typesOfInterest = [];
    } else if (!Array.isArray(typesOfInterest)) {
        typesOfInterest = [typesOfInterest];
    }

    var map = typesOfInterest.reduce(function (r, type) {
        r[type] = true;
        return r;
    }, {});

    var count = bundle.entry.reduce(function (r, resource) {
        var type = resource.content.resourceType;
        if (map[type]) {
            ++r;
        }
        return r;
    }, 0);

    return count;
};

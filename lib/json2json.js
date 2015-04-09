"use strict";

var bbjson2json = require("blue-button-json2json");

var overrideMethods = {
    external: function (template, input) {
        var externalTemplate = template.external;
        var external = this.run(externalTemplate, input);
        if (external !== null) {
            this.bundle.addResource(external);
            return this.bundle.lastId();
        } else {
            return null;
        }
    },
    update: function (template, input) {
        var result = this.run(template, input);
        if (result !== null && template.postProcess) {
            result = template.postProcess(result, this.bundle);
        }
        if (result !== null) {
            if (!template.postProcess) {
                return this.bundle.addResource2(result);
            } else {
                return this.bundle.addResource(result);
            }
        }
        return null;
    }
};

exports.instance = function (bundle) {
    var overrides = {
        external: overrideMethods.external,
        update: overrideMethods.update,
        bundle: bundle
    };
    var engine = bbjson2json.instance(overrides, ['external']);
    return engine;
};

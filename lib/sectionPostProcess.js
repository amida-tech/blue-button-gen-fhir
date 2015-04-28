"use strict";

var _ = require("lodash");
var moment = require("moment");
var bbu = require("blue-button-util");

var config = require('./config.js');
var json2json = require('./json2json');

var arrayset = bbu.arrayset;
var value = json2json.value;

module.exports = {};

module.exports.vitals = (function () {
    var createPanel = function (code, bundleEntries, bundle) {
        var panelInfo = _.find(config.ccdaVitalSignPanels.panels, function (panel) {
            return panel.code === code;
        });
        if (panelInfo) {
            var panelTemplate = {
                content: {
                    resourceType: 'Observation',
                    code: {
                        content: {
                            coding: {
                                value: _.identity,
                                multiple: true
                            },
                            text: {
                                dataKey: 'display'
                            }
                        },
                        dataKey: 'panelInfo'
                    },
                    issued: {
                        dataKey: 'bundleEntries.0.resource.issued'
                    },
                    status: 'final',
                    reliability: 'ok',
                    subject: {
                        dataKey: 'bundleEntries.0.resource.subject'
                    },
                    extension: {
                        constant: [{
                            "url": "http://amida.com/fhir/Profile/extensions#observation-type",
                            "valueCoding": {
                                "code": "8716-3",
                                "display": "Vital signs",
                                "system": "http://loinc.org"
                            }
                        }]
                    },
                    related: {
                        content: {
                            type: 'has-component',
                            target: {
                                content: {
                                    reference: {
                                        dataKey: 'resource.id'
                                    }
                                }
                            }
                        },
                        dataKey: 'bundleEntries'
                    }
                }
            };
            var input = {
                panelInfo: {
                    system: panelInfo.system,
                    code: panelInfo.code,
                    display: panelInfo.display
                },
                bundleEntries: bundleEntries
            };

            var json2jsonInstance = json2json.instance(bundle);
            json2jsonInstance.update(panelTemplate, input);
        }
    };

    var getDate = function (bundleEntry) {
        return moment(bundleEntry.resource.issued).format('YYYYMMDD');
    };

    var getPanelCode = function (bundleEntry) {
        var code = bundleEntry.resource.code.coding[0].code;
        var panel = _.find(config.ccdaVitalSignPanels.panels, function (panel) {
            return panel.children.indexOf(code) !== -1;
        });
        if (panel) {
            return panel.code;
        }
    };

    return function (bundle) {
        var bundleEntries = bundle.entry.map(function (e) {
            return e;
        });
        var groupsByPanel = _.groupBy(bundleEntries, getPanelCode);
        for (var code in groupsByPanel) {
            if (code === "undefined") {
                continue;
            }
            var groupsByDate = _.groupBy(groupsByPanel[code], getDate);
            for (var date in groupsByDate) {
                var groupedBundleEntries = groupsByDate[date];
                createPanel(code, groupedBundleEntries, bundle);
            }
        }
    };
})();

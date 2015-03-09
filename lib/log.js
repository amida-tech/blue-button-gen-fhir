"use strict";

var fs = require('fs');
var path = require('path');

var bunyan = require('bunyan');

var configSource = require('./config.js');

var config = configSource.logging;

if (!fs.existsSync(config.logFolder)) {
    fs.mkdirSync(config.logFolder);
}

var log = bunyan.createLogger({
    name: "ccda2fhir",
    streams: [{
        type: 'rotating-file',
        level: config.level,
        path: path.join(config.logFolder, config.filename),
        period: config.period,
        count: config.count,
        closeOnExit: true
    }],
    closeOnExit: true
});

module.exports = log;

"use strict";

var fs = require('fs');
var path = require('path');
var chai = require('chai');
var bbfhir = require('blue-button-fhir');

var m2fhir = require('../index');

var expect = chai.expect;

describe('gen fhir->gen ccda->gen fhir-> gen ccda', function () {
    var genModelFileName = function (fileName, addl) {
        var base = path.basename(fileName, '.xml');
        var newFileName = base + addl + '.json';
        return newFileName;
    };

    var testContent = function (fileName, outId1, outId2, patient, externalize) {
        return function () {
            var filePath = path.join(rootDir, fileName);
            var content = fs.readFileSync(filePath, 'utf8');
            var bundle = m2fhir.contentToFHIR(content, patient, externalize);
            expect(bundle).to.exist();
            var bundle1FileName = path.join(outputDir, genModelFileName(fileName, '_bundle' + outId1));
            fs.writeFileSync(bundle1FileName, JSON.stringify(bundle, undefined, 4));
            var model1 = bbfhir.toModel(bundle);
            expect(model1).to.exist();
            var model1FileName = path.join(outputDir, genModelFileName(fileName, outId1));
            fs.writeFileSync(model1FileName, JSON.stringify(model1, undefined, 4));
            var bundle2 = m2fhir.modelToFHIR(model1, patient, externalize);
            expect(bundle2).to.exist();
            var bundle2FileName = path.join(outputDir, genModelFileName(fileName, '_bundle' + outId2));
            fs.writeFileSync(bundle2FileName, JSON.stringify(bundle2, undefined, 4));
            var model2 = bbfhir.toModel(bundle2);
            expect(model2).to.exist();
            var model2FileName = path.join(outputDir, genModelFileName(fileName, outId2));
            fs.writeFileSync(model2FileName, JSON.stringify(model2, undefined, 4));
            expect(model1).to.deep.equal(model2);
        };
    };

    var rootDir = path.join(__dirname, './fixtures/ccdaSamples');
    var outputDir = path.join(__dirname, './fixtures/output');

    var fileNames = fs.readdirSync(rootDir);

    fileNames.forEach(function (fileName) {
        it('regenerate for ' + fileName, testContent(fileName, '_1', '_2'));
    });

    var patientEntry = {
        id: "Patient/some-id-here-1987",
        content: {
            resourceType: "Patient",
            identifier: [{
                "system": "http://www.midea-tecg.com",
                "value": "JOE_DOE_IDENTIFIER"
            }],
            name: [{
                family: [
                    "DOE"
                ],
                given: [
                    "JOE"
                ]
            }]
        }
    };

    fileNames.forEach(function (fileName) {
        it('regenerate with patient for ' + fileName, testContent(fileName, '_p1', '_p2', patientEntry));
    });

    fileNames.forEach(function (fileName) {
        it('regenerate with patient, externalize for ' + fileName, testContent(fileName, '_ep1', '_ep2', patientEntry, true));
    });
});

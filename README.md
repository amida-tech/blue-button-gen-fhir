blue-button-gen-fhir
====================

Blue Button Model To FHIR Translator

[![NPM](https://nodei.co/npm/blue-button-gen-fhir.png)](https://nodei.co/npm/blue-button-gen-fhir/)

[![Build Status](https://travis-ci.org/amida-tech/blue-button-gen-fhir.svg)](https://travis-ci.org/amida-tech/blue-button-gen-fhir)
[![Coverage Status](https://coveralls.io/repos/amida-tech/blue-button-gen-fhir/badge.png)](https://coveralls.io/r/amida-tech/blue-button-gen-fhir)

This library translates health data in [blue button model](https://github.com/amida-tech/blue-button-model) to a FHIR Bundle Resource.  Currently the following sections are supported
* Medications
* Problems
* Vitals
* Results
* Allergies

## Usage

Require blue-button-gen-fhir
``` javascript
var mtfhir = require('blue-button-gen-fhir');
```
read in some content that can be parsed by [blue-button](https://github.com/amida-tech/blue-button)
``` javascript
var fs = require('fs');

var filePath = 'path/to/ccdafile.xml';
var content = fs.readFileSync(filePath, 'utf8');
```
translate the content to a FHIR Bundle resource
``` javascript
var bundle = mtfhir.contentToFHIR(content);
console.log(bundle);	
```

You can also pass a Patient resource to contain patient references
``` javascript
var patientEntry = {
    id: 'Patient/123456789'
    content: {
        resourceType: Patient,
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

mtfhir.contentToFHIR(content, patientEntry);
```
and all the patient references in the Bundle will be updated.  Otherwise the patient references are not assigned.


By default Medication and Substance resources are included as internal resources. You can request them as external resources instead
``` javascript
var externalize=true;
mtfhir.contentToFHIR(content, patientEntry, externalize);
```

## Configuration

This project is configured by editing the `lib/config.json` file.  There are two configuration items
* `logging`: See [bunyan](https://github.com/trentm/node-bunyan) for configuration options.
* `ccdaVitalSignPanel`: Observation resources that are created for vitals can be put into a Observation panel.  This item defines vital panels and which vitals will be in the panels. 

## Testing

[Mocha](http://mochajs.org/) and [Grunt](http://gruntjs.com/) are used for testing this project.  Simply run `grunt` in the project directory to run all the tests.

## License

Licensed under [Apache 2.0](./LICENSE).


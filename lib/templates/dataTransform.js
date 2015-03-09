"use strict";

var _ = require('lodash');
var bbu = require('blue-button-util');

var rootLogger = require('../log');

var logger = rootLogger.child({
    module: 'dataTransform'
});

var bbuo = bbu.object;

exports.rxNormOnly = (function () {
    var getRxNormProduct = function (input) {
        var product = bbuo.deepValue(input, 'product.product');
        if (product) {
            if (product.code_system_name === 'RXNORM') {
                return product;
            } else if (product.translations) {
                var result = _.find(product.translations, function (translation) {
                    return translation.code_system_name === 'RXNORM';
                });
                if (result) {
                    return result;
                }
            }
        }
        return null;
    };
    var bbu = require('blue-button-util');

    return function (input) {
        var unencoded_name = bbuo.deepValue(input, 'product.unencoded_name');
        var product = getRxNormProduct(input);
        if (unencoded_name || product) {
            var result = {};
            if (unencoded_name) {
                result.unencoded_name = unencoded_name;
            }
            if (product) {
                result.product = product;
            }
            return {
                product: result
            };
        } else {
            return null;
        }
    };
})();

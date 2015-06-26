"use strict";

var _ = require('lodash');

var rootLogger = require('../log');

var logger = rootLogger.child({
    module: 'dataTransform'
});

exports.rxNormOnly = (function () {
    var getRxNormProduct = function (input) {
        var product = _.get(input, 'product.product');
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

    return function (input) {
        var unencoded_name = _.get(input, 'product.unencoded_name');
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

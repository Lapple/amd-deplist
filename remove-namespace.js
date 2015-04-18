var _ = require('lodash');
var format = require('util').format;

module.exports = function(ns, contents) {
    if (_.isString(ns)) {
        return contents.replace(
            new RegExp(
                // Not matching `require` because otherwise main modules
                // written as:
                //
                //     ns.require(['require'], function(require) { /* .. */ });
                //
                // are not parsed at all.
                format('%s\\.(define)', ns),
                'g'),
            '$1');
    } else {
        return contents;
    }
};

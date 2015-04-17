var path = require('path');
var EOL = require('os').EOL;

var _ = require('lodash');
var amodroTrace = require('amodro-trace');
var cjsTransform = require('amodro-trace/read/cjs');

function trace(id, options) {
    var cwd = process.cwd();

    amodroTrace(
        {
            rootDir: cwd,
            id: id,
            readTransform: function(id, url, contents) {
                return cjsTransform(url, contents);
            }
        },
        {
            namespace: options.namespace
        }
    ).then(function(r) {
        console.log(
            _(r.traced)
                .pluck('path')
                .unique()
                .map(
                    path.relative.bind(
                        path,
                        cwd))
                .sort()
                .value()
                .join(EOL));
    }).catch(function(error) {
        console.error(error);
    });
}

module.exports = trace;

var path = require('path');
var EOL = require('os').EOL;

var _ = require('lodash');
var amodroTrace = require('amodro-trace');
var cjsTransform = require('amodro-trace/read/cjs');

var removeNamespace = require('./remove-namespace');
var moduleId = require('./module-id');

function trace(file, options) {
    var root = options.rootdir;
    var paths = options.paths;

    amodroTrace(
        {
            rootDir: root,
            id: moduleId(file, root),
            readTransform: function(id, url, contents) {
                return cjsTransform(
                    url,
                    removeNamespace(
                        options.ns,
                        contents));
            }
        },
        {
            paths: paths
        }
    ).then(function(r) {
        console.log(
            _(r.traced)
                .pluck('path')
                .unique()
                .map(
                    path.relative.bind(
                        path,
                        root))
                .value()
                .join(EOL));
    }).catch(function(error) {
        console.error(error);
    });
}

module.exports = trace;

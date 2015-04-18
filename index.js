var path = require('path');
var EOL = require('os').EOL;

var _ = require('lodash');
var Promise = require('bluebird')
var amodroTrace = require('amodro-trace');
var cjsTransform = require('amodro-trace/read/cjs');

var removeNamespace = require('./remove-namespace');
var moduleId = require('./module-id');

function trace(files, options) {
    Promise
        .all(
            files.map(
                _.partial(traceFile, _, options)))
        .then(function(rs) {
            console.log(
                _(rs)
                    .flatten()
                    .unique()
                    .value()
                    .join(EOL));
        })
        .catch(function(error) {
            console.error(error);
        });
}

function traceFile(file, options) {
    var root = options.rootdir;
    var paths = options.paths;

    return amodroTrace(
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
        return _(r.traced)
            .pluck('path')
            .map(
                path.relative.bind(
                    path,
                    root))
            .value();
    });
}

module.exports = trace;

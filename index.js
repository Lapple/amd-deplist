var path = require('path');
var EOL = require('os').EOL;

var _ = require('lodash');
var amodroTrace = require('amodro-trace');
var cjsTransform = require('amodro-trace/read/cjs');

function trace(id, options) {
    var root = options.rootdir;
    var paths = options.paths;

    amodroTrace(
        {
            rootDir: root,
            id: path.relative(root, id),
            readTransform: function(id, url, contents) {
                return cjsTransform(url, contents);
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

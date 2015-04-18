var path = require('path');

module.exports = function(file, rootDir) {
    return path.join(
        path.relative(
            rootDir,
            path.dirname(file)),
        path.basename(
            file,
            path.extname(file)));
};

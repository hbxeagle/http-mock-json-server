var path = require('path');

Object.keys(path).forEach(function (key) {
    if (typeof path[key] === 'function') {
        exports[key] = function () {
            return path[key].apply(path, arguments);
        };
    }
    else {
        exports[key] = path[key];
    }
});

exports.normalize = function (p) {
    return path.normalize(p).split(path.sep).join('/');
};
exports.join = function () {
    var args = Array.prototype.map.call(arguments, function (p) {
        return path.normalize(p);
    });
    return exports.normalize(path.join.apply(path, args));
};
exports.resolve = function () {
    var args = Array.prototype.map.call(arguments, function (p) {
        return path.normalize(p);
    });
    return exports.normalize(path.resolve.apply(path, args));
};
exports.relative = function () {
    var args = Array.prototype.map.call(arguments, function (p) {
        return path.normalize(p);
    });
    return exports.normalize(path.relative.apply(path, args));
};

import fs from 'fs'
import chalk from 'chalk'
import path from './path'

exports.findFileSync = function (filename, start, stop) {
  start = path.resolve(start);
  stop = stop && path.resolve(stop) || '';
  var result;
  while (!/^(?:[a-z]:)?$/i.test(start) && start.indexOf(stop) === 0) {
    if (fs.existsSync(result = start + '/' + filename) && fs.statSync(result).isFile()) {
      return result;
    }
    start = start.replace(/\/[^\/]+$/, '');
  }
};

exports.writeFileSync = function (filename, filedata) {
  if (!fs.existsSync(path.dirname(filename))) {
    var segments = filename.split('/');
    var segment = segments.shift() + '/' + segments.shift();
    while (segments.length) {
      if (!fs.existsSync(segment)) {
        fs.mkdirSync(segment);
      }
      segment += '/' + segments.shift();
    }
  }
  fs.writeFileSync(filename, filedata);
};

exports.readFileSync = function (filename, buffer) {
  return fs.readFileSync(filename, !buffer && {
    encoding: 'utf8'
  });
};

exports.readJSONSync = function (filename) {
  let filedata, data;
  try {
    filedata = fs.readFileSync(filename);
    if (filedata) {
      data = JSON.parse(filedata);
    }
  } catch (e) {
    return null;
  }
  return data;
};

exports.writeJSONSync = function (filename, filedata) {
  fs.writeFileSync(filename, JSON.stringify(filedata, null, 2));
};

exports.readFileCommit = function (filename, commit, callback, buffer) {
  commit.getEntry(filename, function (err, entry) {
    if (err || !entry.isFile()) {
      callback(filename + ' doesn\'t exist');
    } else {
      entry.getBlob(function (err, blob) {
        if (err) {
          callback(err);
        } else {
          callback(null, buffer ? blob.content() : blob.toString());
        }
      });
    }
  });
};

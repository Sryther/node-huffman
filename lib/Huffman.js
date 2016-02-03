var _ = require('lodash');

function Huffman(tree, format) {
  if (!tree) throw new Error('Tree not given');
  if (!format) throw new Error('Format not given');

  this.tree = tree;
  this.format = format;
  this.decisions = this.regexpsConstruction(this.tree);
}

Huffman.prototype.decompress = function decompress(content) {
  buffer = new Buffer(content);
  var binary = Number("0x" + buffer.toString()).toString(2); // Transform to binary representation
  var decompressed = this.match(binary);
  return this.assemble(decompressed);
};

Huffman.prototype.regexpsConstruction = function regexpsConstruction(tree, array, regexp, k) {
  // Declarations and Initilizations
  if (!array) array = [];
  if (!regexp) regexp = '';
  if (!k) k = '';

  regexp += k;

  if (typeof tree === "object") {
    Object.keys(tree).forEach(function(key) {
      regexpsConstruction(tree[key], array, regexp, key.toString());
    });

    return _.sortBy(array, function(o) { return o.delta; });
  } else {
    var delta = tree;
    array.push({
      'path': regexp,
      'regexp': new RegExp('^' + regexp), // Add ^ symbol to specify that we catch at the begin of the string
      'delta': delta
    });
    regexp = '';
  }
};

Huffman.prototype.assemble = function(deltas) {
  var res = [];
  var i = 0;
  deltas.forEach(function(delta, key) {
    var start = 0;
    if (deltas[i - 1]) {
      start = res[i - 1];
    }

    res.push(start + delta);
    i++;
  });
  return res;
};

Huffman.prototype.match = function match(binary) {
  var str = _.clone(binary);
  var result = [];
  var format = this.format;
  var decisions = this.decisions;

  function search(decision, key) {
    var matched = str.match(decision.regexp);
    if (matched) {
      // Remove matched content
      str = str.slice(matched[0].length, str.length);

      // Raw data
      if (decision.delta == 'T') {
        var bufferRealData = new Buffer(str.slice(0, format), 'binary');
        var realData = Number("0b" + bufferRealData.toString()).toString(10);

        result.push(parseInt(realData));

        // Remove matched content
        str = str.slice(format, str.length);
        i = 0;
        return;
      } else {
        var base2 = Math.pow(2, decision.delta - decision.path.length - 1);
        var indexData = decision.delta - decision.path.length;
        var isNegative = str.slice(0, 1) == '1';
        var power = isNegative ? -1 * base2 : base2;
        var dataLength = parseInt(decision.delta) - decision.path.length;
        var toBuff = str.slice(1, decision.delta - decision.path.length);
        var bufferDelta = new Buffer(toBuff, 'binary');
        var binaryDelta = bufferDelta.toString().length ? bufferDelta.toString() : 0;
        var delta = parseInt(Number("0b" + binaryDelta).toString(10));

        var sanitzedDelta = isNegative ? -1 * delta : delta;
        var res = parseInt(power) + sanitzedDelta;

        result.push(res);

        // Remove matched content
        str = str.slice(dataLength, str.length);
        i = 0;
        return;
      }
    } else {
      if (i > decisions.length) {
        str = '';
      }
    }
    i++;
  }

  var i = 0;
  while (str.length !== 0) {
    decisions.forEach(search);
  }
  return result;
};

function reverse(s){
  return s.split("").reverse().join("");
}

module.exports = Huffman;

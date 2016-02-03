var a = "ca24c24098230721a2dddd00ca143c5c0c86edbd03092808ca0400010d0d09c81e63b859";
var b = new Buffer( a, 'hex' );
var string = require('string');

var littleEndianString = '';

function swap8(val) {
  return ((val & 0x1) << 7) | ((val & 0x2) << 5) | ((val & 0x4) << 3) | ((val & 0x8) << 1) | ((val >> 1) & 0x8) | ((val >> 3) & 0x4) | ((val >> 5) & 0x2) | ((val >> 7) & 0x1);
}

for(var i = 0;i< b.length; i++ ){
  var x = b.readUInt8(i);
  littleEndianString += string(parseFloat(swap8(x)).toString(16)).padLeft(2, '0').s;
}

console.log('littleEndianString',littleEndianString);

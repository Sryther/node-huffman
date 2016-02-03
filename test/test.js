var Huffman = require('../index');
var should = require('should');
var _ = require('lodash');
var content = '900ca3536200';
var content2 = '5324430219c4e08445bbbb0053283c3a3061b7bdc090141053200080b0b0901378c61d9a';

var tree = {
  0: {
    1: 3,
    0: {
      1: 6,
      0: {
        1: 8,
        0: {
          1: 10,
          0: {
            1: 13,
            0: {
              1: 16,
              0: {
                1: {
                  0: 21,
                  1: 22
                },
                0: {
                  0: 26,
                  1: {
                    0: 29,
                    1: {
                      0: 33,
                      1: 34
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  1: {
    1: 2,
    0: {
      1: 5,
      0: {
        1: 'T',
        0: {
          1: 11,
          0: {
            1: 14,
            0: {
              1: {
                0: 18,
                1: 19
              },
              0: {
                1: {
                  0: 23,
                  1: 24
                },
                0: {
                  0: 25,
                  1: {
                    1: 28,
                    0: {
                      0: 31,
                      1: 32
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};


describe('Huffman', function() {
  it('creates a new huffman instance using a tree and data format', function(done) {
    huff = new Huffman(tree, 16);
    done();
  });

  it('does not create a new huffman instance without using a tree and without data format', function(done) {
    new Huffman(tree).should.throw(Error);
    done();
  });

  it('does not create a new huffman instance using a tree and without data format', function(done) {
    new Huffman(tree).should.throw(Error);
    done();
  });

  it('decompress ' + content, function(done) {
    huff.decompress(content).join(";").should.be.equal("202;197;198;197;196;204");
    done();
  });

  it('decompress ' + content2, function(done) {
    huff.decompress(content2).join(";").should.be.equal("202;197;198;197;196;204");
    done();
  });
});

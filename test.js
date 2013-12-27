'use strict';

var assert = require('assert');
var http = require('http');
var zlib = require('zlib');
var HelloWorld = require('stream').Readable;
var PassThrough = require('stream').PassThrough;
var fh = require('flowhttp');
var Decoder = require('./index');

// The data being sent back from the server on each request
HelloWorld.prototype._read = function (n) {
  this.push('Hello World');
  this.push();
};

fh.agent = false; // opt out of connection pooling - makes the tests fail

describe('Decoder', function () {
  it('should be a PassThrough stream', function () {
    assert(Decoder.prototype instanceof PassThrough, 'The Stream object should be an instance of stream.PassThrough');
  });
});

describe('decoder', function () {
  var options = {
    host: 'localhost',
    port: 5000
  };
  var server;

  before(function (done) {
    server = http.createServer(function (req, res) {
      var helloWorld = new HelloWorld();
      switch (req.headers['accept-encoding']) {
        case 'gzip':
          res.writeHead(200, { 'Content-Encoding': 'gzip' });
          helloWorld.pipe(zlib.createGzip()).pipe(res);
          break;
        case 'deflate':
          res.writeHead(200, { 'Content-Encoding': 'deflate' });
          helloWorld.pipe(zlib.createDeflate()).pipe(res);
          break;
        default:
          helloWorld.pipe(res);
      }
    });
    server.listen(options.port, done);
  });

  after(function () {
    server.close();
  });

  it('should get the expected result if no encoding is used', function (done) {
    options.headers = {};
    fh(options)
      .pipe(new Decoder())
      .on('data', function (chunk) {
        assert.equal(chunk.toString(), 'Hello World');
      })
      .on('end', done);
  });

  it('should get the expected result if gzip encoding is used', function (done) {
    options.headers = { 'Accept-Encoding': 'gzip' };
    fh(options)
      .pipe(new Decoder())
      .on('data', function (chunk) {
        assert.equal(chunk, 'Hello World');
      })
      .on('end', done);
  });

  it('should get the expected result if deflate encoding is used', function (done) {
    options.headers = { 'Accept-Encoding': 'deflate' };
    fh(options)
      .pipe(new Decoder())
      .on('data', function (chunk) {
        assert.equal(chunk, 'Hello World');
      })
      .on('end', done);
  });
});

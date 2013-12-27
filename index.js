'use strict';

var util = require('util');
var zlib = require('zlib');
var PassThrough = require('stream').PassThrough;

var supportedEncodings = ['gzip', 'deflate'];

// A PassThrough stream that automatically decodes gzip and deflate encoded
// HTTP responses.
var Decoder = function () {
  var decoder = this;
  PassThrough.call(this);

  // Listen for the special `response` event emitted by the flowHttp
  // module
  this.once('response', function (res) {
    // Forward the `response` event down the pipe-line
    decoder._forwardFlowHttpResponse(res);
    if (supportedEncodings.indexOf(res.headers['content-encoding']) !== -1) {
      decoder._src.unpipe(decoder);
      decoder._src.pipe(zlib.createUnzip()).pipe(decoder);
    }
  });

  // Record the source of the pipe to be used above
  this.once('pipe', function (src) {
    decoder._src = src;
  });
};

util.inherits(Decoder, PassThrough);

module.exports = Decoder;

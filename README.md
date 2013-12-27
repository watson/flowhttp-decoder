# flowHttp-decoder

A [flowHttp](https://github.com/watson/flowhttp) extension used for
decoding gzip og deflate encoded HTTP responses.

[![build
status](https://secure.travis-ci.org/watson/flowhttp-decoder.png)](http://travis-ci.org/watson/flowhttp-decoder)

## Install

```
npm install flowhttp-decoder
```

## Usage

This module is intended to be used with the
[flowHttp](https://github.com/watson/flowhttp) module.

Use this module to create a `Decoder` stream. If piped data from a
`flowHttp` request, it will detect if the response is encoded using
either gzip og deflate and automatically decode it. If the body isn't
encoded using one of these encodings, it's just passed through the
stream without any modifications.

```javascript
var flowHttp = require('flowhttp');
var Decoder = require('flowhttp-decoder');

flowHttp('http://example.com')
  .pipe(new Decoder())
  .pipe(process.stdout);
```

## License

MIT

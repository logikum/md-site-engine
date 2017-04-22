'use strict';

var Element = function( html, tokens, source ) {

  this.html = html;
  this.tokens = tokens;

  Object.defineProperty( this, 'source', {
    get: function () {
      return source;
    },
    enumerable: true,
    configurable: false
  } );

  this.isStatic = tokens.length === 0 ||
    tokens.every( function( token ) {
      return token.name[ 0 ] === '=';
    });
};

module.exports = Element;

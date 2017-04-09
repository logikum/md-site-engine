'use strict';

var Element = function( text, tokens ) {

  this.text = text;
  this.tokens = tokens;
  this.isStatic = tokens.length === 0 ||
    tokens.every( function( token ) {
      return token.name[ 0 ] === '=';
    });
};

module.exports = Element;

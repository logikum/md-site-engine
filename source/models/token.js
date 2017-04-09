'use strict';

var Token = function( expression ) {

  Object.defineProperty( this, 'expression', {
    get: function () {
      return expression;
    },
    enumerable: true,
    configurable: false
  } );

  Object.defineProperty( this, 'name', {
    get: function () {
      var id = expression.substring( 2, expression.length - 2 ).trim();
      return this.isStatic || this.isControl ? id.substring( 1 ) : id;
    },
    enumerable: true,
    configurable: false
  } );

  Object.defineProperty( this, 'isStatic', {
    get: function () {
      return expression.indexOf( '=' ) > 0;
    },
    enumerable: true,
    configurable: false
  } );

  Object.defineProperty( this, 'isControl', {
    get: function () {
      return expression.indexOf( '#' ) > 0;
    },
    enumerable: true,
    configurable: false
  } );
};

module.exports = Token;

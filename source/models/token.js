'use strict';

/**
 * Represents a token in contents and components.
 * @param {string} expression - The full token expression.
 * @constructor
 */
var Token = function( expression ) {

  /**
   * Gets the full token expression.
   * @type {string}
   * @readonly
   */
  Object.defineProperty( this, 'expression', {
    get: function () {
      return expression;
    },
    enumerable: true,
    configurable: false
  } );

  /**
   * Gets the name of the token.
   * @type {string}
   * @readonly
   */
  Object.defineProperty( this, 'name', {
    get: function () {
      var id = expression.substring( 2, expression.length - 2 ).trim();
      return this.isStatic || this.isControl || this.isData ? id.substring( 1 ) : id;
    },
    enumerable: true,
    configurable: false
  } );

  /**
   * Indicates whether the token represents a static segment.
   * @type {Boolean}
   * @readonly
   */
  Object.defineProperty( this, 'isStatic', {
    get: function () {
      return expression.indexOf( '=' ) > 0;
    },
    enumerable: true,
    configurable: false
  } );

  /**
   * Returns true when the token represents a control; otherwise false.
   * @type {Boolean}
   * @readonly
   */
  Object.defineProperty( this, 'isControl', {
    get: function () {
      return expression.indexOf( '#' ) > 0;
    },
    enumerable: true,
    configurable: false
  } );

  /**
   * Returns true when the token represents a context data property; otherwise false.
   * @type {Boolean}
   * @readonly
   */
  Object.defineProperty( this, 'isData', {
    get: function () {
      return expression.indexOf( '.' ) > 0;
    },
    enumerable: true,
    configurable: false
  } );
};

module.exports = Token;

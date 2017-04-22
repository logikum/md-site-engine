'use strict';

/**
 * Serves as the base for contents and components.
 * @param {string} html - The HTML text of the element.
 * @param {Array.<Token>} tokens - The list of tokens found in the element.
 * @param {string} source - The type of the source file of the element: "html" or "markdown".
 * @constructor
 */
var Element = function( html, tokens, source ) {

  /**
   * Gets or sets the HTML text of the element.
   * @type {string}
   */
  this.html = html;

  /**
   * Gets or sets the  list of tokens found in the element.
   * @type {Array.<Token>}
   */
  this.tokens = tokens;

  /**
   * Gets the type of the source file of the element: "html" or "markdown".
   * @type {string}
   * @readonly
   */
  Object.defineProperty( this, 'source', {
    get: function () {
      return source;
    },
    enumerable: true,
    configurable: false
  } );

  /**
   * Indicates whether the content of the element can change.
   * @type {Boolean}
   * @readonly
   */
  Object.defineProperty( this, 'isStatic', {
    get: function () {
      return tokens.length === 0 ||
        tokens.every( function( token ) {
          return token.name[ 0 ] === '=';
        } );
    },
    enumerable: true,
    configurable: false
  } );
};

module.exports = Element;

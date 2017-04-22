'use strict';

var util = require('util');
var Element = require( './element.js' );

/**
 * Represents a component.
 * @param {string} html - The HTML text of the element.
 * @param {Array.<Token>} tokens - The list of tokens found in the element.
 * @param {Boolean} isDocument - Indicates if the component is a document.
 * @param {Boolean} isLayout - Indicates if the component is a layout.
 * @param {string} source - The type of the source file of the element: "html" or "markdown".
 * @constructor
 */
var Component = function( html, tokens, isDocument, isLayout, source ) {

  Element.call( this, html, tokens, source );

  /**
   * Returns true if the component is a document; otherwise false.
   * @type {Boolean}
   * @readonly
   */
  Object.defineProperty( this, 'isDocument', {
    get: function () {
      return isDocument;
    },
    enumerable: true,
    configurable: false
  } );

  /**
   * Returns true if the component is a layout; otherwise false.
   * @type {Boolean}
   * @readonly
   */
  Object.defineProperty( this, 'isLayout', {
    get: function () {
      return isLayout;
    },
    enumerable: true,
    configurable: false
  } );

  /**
   * Returns true if the component is a segment; otherwise false.
   * @type {Boolean}
   * @readonly
   */
  Object.defineProperty( this, 'isSegment', {
    get: function () {
      return !isDocument && !isLayout;
    },
    enumerable: true,
    configurable: false
  } );
};

util.inherits(Component, Element);

module.exports = Component;

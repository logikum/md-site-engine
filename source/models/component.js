'use strict';

var util = require('util');
var Element = require( './element.js' );

var Component = function( text, tokens, isDocument, isLayout, isHtml ) {

  Element.call( this, text, tokens );

  Object.defineProperty( this, 'isDocument', {
    get: function () {
      return isDocument;
    },
    enumerable: true,
    configurable: false
  } );

  Object.defineProperty( this, 'isLayout', {
    get: function () {
      return isLayout;
    },
    enumerable: true,
    configurable: false
  } );

  Object.defineProperty( this, 'isSegment', {
    get: function () {
      return !isDocument && !isLayout;
    },
    enumerable: true,
    configurable: false
  } );

  Object.defineProperty( this, 'isHtml', {
    get: function () {
      return isHtml;
    },
    enumerable: true,
    configurable: false
  } );
};

util.inherits(Component, Element);

module.exports = Component;

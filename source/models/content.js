'use strict';

var util = require('util');
var Element = require( './element.js' );

/**
 * Represents a content.
 * @param {string} html - The HTML text of the content.
 * @param {Array.<Token>} tokens - The list of tokens found in the content.
 * @param {string} source - The type of the source file of the content: "html" or "markdown".
 * @constructor
 */
var Content = function( html, tokens, source ) {

  Element.call( this, html, tokens, source );
};

util.inherits(Content, Element);

module.exports = Content;

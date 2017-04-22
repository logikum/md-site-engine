'use strict';

var util = require('util');
var Element = require( './element.js' );

var Content = function( html, tokens, source ) {

  Element.call( this, html, tokens, source );
};

util.inherits(Content, Element);

module.exports = Content;

'use strict';

var util = require('util');
var Element = require( './element.js' );

var Content = function( text, tokens ) {

  Element.call( this, text, tokens );
};

util.inherits(Content, Element);

module.exports = Content;

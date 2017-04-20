'use strict';

var freeze = require( './../utilities/freeze.js' );

function getMainProperties( definitions ) {
  var main = { };
  for (var property in definitions) {
    if (property.indexOf( '$-' ) !== 0 && property.indexOf( 'segment.' ) !== 0)
      main[ property ] = definitions[ property ];
  }
  return main;
}

function getSegmentProperties( definitions ) {
  var segments = { };
  for (var property in definitions) {
    if (property.indexOf( '$-') === 0)
      segments[ property.substring( 2 ) ] = definitions[ property ];
    if (property.indexOf( 'segment.') === 0)
      segments[ property.substring( 8 ) ] = definitions[ property ];
  }
  return segments;
}

var Metadata = function( definitions, path ) {

  // Search engine properties.
  this.title = '';
  this.keywords = '';
  this.description = '';

  // Menu properties.
  this.text = '';
  this.order = 0;
  this.hidden = false;
  this.umbel = false;

  // Page properties.
  this.id = '';
  this.path = path;
  this.document = '';
  this.layout = '';
  this.segments = { };
  this.searchable = true;

  Object.assign( this, getMainProperties( definitions ) );
  Object.assign( this.segments, getSegmentProperties( definitions ) );

  // Set default identity.
  if (!this.id)
    this.id = path;

  // Immutable object.
  freeze( this );
};

module.exports = Metadata;

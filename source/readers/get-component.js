'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var logger = require( './../utilities/logger.js' );
var Token = require( './../models/token.js' );
var Component = require( './../models/component.js' );

function getComponent( componentFile, layoutSegment, contentSegment ) {

  // Determine the path.
  var segmentPath = path.join( process.cwd(), componentFile );

  // Get the file content.
  var text = fs.readFileSync( segmentPath, { encoding: 'utf-8' } );

  // Find tokens.
  var re = /(\{\{\s*[=#]?[\w-\/]+\s*}})/g;
  var tokens = [ ];
  var j = 0;
  var isDocument = false;
  var isLayout = false;
  for (var matches = re.exec( text ); matches !== null; matches = re.exec( text )) {
    var token = new Token( matches[ 1 ] );
    tokens[ j++ ] = token;
    isDocument = isDocument || token.name === layoutSegment;
    isLayout = isLayout || token.name === contentSegment;
  }

  // Check component type.
  if (isDocument && isLayout)
    logger.showError( '"' + componentFile + '" cannot be both a document and a layout.' );

  // Create and return the component.
  return new Component( text, tokens, isDocument, isLayout, true );
}

module.exports = getComponent;

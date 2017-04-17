'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var marked = require( 'marked' );
var Component = require( './../models/component.js' );
var Token = require( './../models/token.js' );
var logger = require( './../utilities/logger.js' );

function getSegment(
  segmentFile, language, references, renderer, layoutSegment, contentSegment
) {

  // Determine the path.
  var segmentPath = path.join( process.cwd(), segmentFile );

  // Get the file segment.
  var text = fs.readFileSync( segmentPath, { encoding: 'utf-8' } );

  // Convert the markdown content.
  text = marked( text + '\n' + references.get( language ), { renderer: renderer } );

  // Find tokens.
  var re = /(\{\{\s*[=#]?[\w-\/]+\s*}})/g;
  var tokens = [ ];
  var j = 0;
  for (var matches = re.exec( text ); matches !== null; matches = re.exec( text )) {
    var token = new Token( matches[ 1 ] );

    // Check invalid components.
    if (token.name === layoutSegment || token.name === contentSegment)
      logger.showError( '"' + segmentFile + '" may not contain layout and content tokens.' );
    else
      tokens[ j++ ] = token;
  }

  // Create and return the segment.
  return new Component( text, tokens, false, false, false );
}

module.exports = getSegment;

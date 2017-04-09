'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var Token = require( './../models/token.js' );
var Content = require( './../models/content.js' );

function getContent( contentFile ) {

  // Determine the path.
  var contentPath = path.join( process.cwd(), contentFile );

  // Get the file content.
  var text = fs.readFileSync( contentPath, { encoding: 'utf-8' } );

  // Find tokens.
  var re = /(\{\{\s*[=#]?[\w-\/]+\s*}})/g;
  var tokens = [ ];
  var j = 0;
  for (var matches = re.exec( text ); matches !== null; matches = re.exec( text )) {
    tokens[ j++ ] = new Token( matches[ 1 ] );
  }

  return new Content( text, tokens );
}

module.exports = getContent;

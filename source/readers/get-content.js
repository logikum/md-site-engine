'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var Token = require( './../models/token.js' );
var Content = require( './../models/content.js' );

/**
 * Reads the content of a content file.
 * @param {string} contentFile - The path of the content file.
 * @param {string} source - The type of the content file (html|markdown).
 * @returns {Content} The content object.
 */
function getContent( contentFile, source ) {

  // Determine the path.
  var contentPath = path.join( process.cwd(), contentFile );

  // Get the file content.
  var html = fs.readFileSync( contentPath, { encoding: 'utf-8' } );

  // Find tokens.
  var re = /(\{\{\s*[=#.]?[\w-\/!]+\s*}})/g;
  var tokens = [ ];
  var j = 0;
  for (var matches = re.exec( html ); matches !== null; matches = re.exec( html )) {
    tokens[ j++ ] = new Token( matches[ 1 ] );
  }

  // Create and return the content.
  return new Content( html, tokens, source );
}

module.exports = getContent;

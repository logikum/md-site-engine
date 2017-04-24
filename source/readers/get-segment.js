'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var marked = require( 'marked' );
var Component = require( './../models/component.js' );
var Token = require( './../models/token.js' );
var logger = require( './../utilities/logger.js' );

/**
 * Reads the content of a component file (markdown).
 * @param {string} segmentFile - The path of the segment file.
 * @param {string} layoutSegment - The name of the layout segment.
 * @param {string} contentSegment - The name of the layout segment.
 * @param {ReferenceDrawer} references - The reference storage.
 * @param {string} language - The language of the segment file.
 * @param {marked.Renderer} renderer - The custom markdown renderer.
 * @returns {Component} The segment object.
 */
function getSegment(
  segmentFile, layoutSegment, contentSegment, references, language, renderer
) {

  // Determine the path.
  var segmentPath = path.join( process.cwd(), segmentFile );

  // Get the file segment.
  var text = fs.readFileSync( segmentPath, { encoding: 'utf-8' } );

  // Convert the markdown content.
  var html = marked( text + '\n' + references.get( language ), { renderer: renderer } );

  // Find tokens.
  var re = /(\{\{\s*[=#]?[\w-\/]+\s*}})/g;
  var tokens = [ ];
  var j = 0;
  for (var matches = re.exec( html ); matches !== null; matches = re.exec( html )) {
    var token = new Token( matches[ 1 ] );

    // Check invalid components.
    if (token.name === layoutSegment || token.name === contentSegment)
      logger.showError( '"' + segmentFile + '" may not contain layout and content tokens.' );
    else
      tokens[ j++ ] = token;
  }

  // Create and return the segment.
  return new Component( html, tokens, false, false, 'markdown' );
}

module.exports = getSegment;

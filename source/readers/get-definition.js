'use strict';

var Metadata = require( './../models/metadata.js' );

/**
 * Reads the metadata of a content text.
 * @param {string} content - The full text of a content file.
 * @returns {Metadata} - The metadata object.
 */
function getDefinition( content ) {

  var definition = { };
  var lines = content.html.split( '\n' );

  // Starts with menu info?
  if (lines.length && lines[ 0 ].substring( 0, 4 ) === '<!--') {

    var line = lines.shift();
    var canDo = true;
    var key;

    // Build content definition.
    do {
      line = lines.shift();
      // End of definition?
      if (!line || /-->/.test( line ) )
        canDo = false;
      // Comment?
      else if (line.substring( 0, 3 ) === '---') {
        // Skip this line.
      } else if (line.substring( 0, 3 ) === '   ') {
        // Continue previous item?
        if (key)
          definition[ key ] = definition[ key ].trim() + ' ' + line.substring( 3 ).trim();
      }
      // New key-value pair?
      else {
        var pair = line.split( ':' );
        if (pair.length > 1) {
          key = pair[ 0 ].trim();
          definition[ key ] = pair[ 1 ].trim();
        }
      }
    } while (canDo);

    // Remove the definition part from the content text.
    content.html = lines.join( '\n' );
  }

  // Return the metadata.
  return new Metadata( definition, content.path );
}

module.exports = getDefinition;

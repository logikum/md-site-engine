'use strict';

var fs = require( 'fs' );
var path = require( 'path' );

function getReference( referenceFile ) {
  var text = '';

  // Read references file.
  var referencePath = path.join( process.cwd(), referenceFile );

  var stats = fs.statSync( referencePath );
  if (stats && stats.isFile()) {
    text = fs.readFileSync( referencePath, { encoding: 'utf8' } );

    // Find common root definition (tilde reference).
    var tilde = '';
    var lines = text.split( '\n' );
    for (var i = 0; i < lines.length; i++) {
      var line = lines[ i ].trim();
      if (line.length >= 5 && line.substr( 0, 5 ) === '[~]: ') {
        tilde = line.substr( 5 ).trim();
        lines.splice( i, 1 );
        break;
      }
    }
    text = lines.join( '\n' );

    // Replace tildes with common root.
    if (tilde) {
      text = text.replace( / ~/g, ' ' + tilde );
    }
    text = '\n\n' + text;
  }
  return text;
}

module.exports = getReference;

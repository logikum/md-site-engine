'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var logger = require( './../utilities/logger.js' );

var getReference = require( './get-reference.js' );

function readReferences( componentPath, referenceFile, filingCabinet
) {
  logger.showInfo( '*** Reading references...' );

  // Initialize the store.
  getReferences( componentPath, 0, '', referenceFile, filingCabinet.references
  );
}

function getReferences( componentDir, level, levelPath, referenceFile, referenceDrawer ) {

  // Read directory items.
  var componentPath = path.join( process.cwd(), componentDir );
  var items = fs.readdirSync( componentPath );

  items.forEach( function ( item ) {

    var itemPath = path.join( componentDir, item );
    var prefix = levelPath === '' ? '' : levelPath + '/';

    // Get item info.
    var stats = fs.statSync( path.join( process.cwd(), itemPath ) );
    if (stats.isDirectory()) {

      // Get language specific references.
      if (level === 0)
        getReferences( itemPath, level + 1, prefix + item, referenceFile, referenceDrawer );
    }
    else if (stats.isFile()) {

      var ext = path.extname( item );
      if (ext === '.txt' && path.basename( item ) === referenceFile) {

        // Read reference file.
        var componentPath = prefix + path.basename( item, ext );
        referenceDrawer.add( componentPath, getReference( itemPath ) );
        logger.fileProcessed( 'Reference', itemPath );
      }
    }
  } )
}

module.exports = readReferences;

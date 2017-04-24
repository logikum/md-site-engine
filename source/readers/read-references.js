'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var logger = require( './../utilities/logger.js' );

var getReference = require( './get-reference.js' );

/**
 * Read all references.
 * @param {string} componentPath - The path of the components directory.
 * @param {string} referenceFile - The name of the reference files.
 * @param {FilingCabinet} filingCabinet - The file manager object.
 */
function readReferences( componentPath, referenceFile, filingCabinet
) {
  logger.showInfo( '*** Reading references...' );

  // Initialize the store.
  getReferences( componentPath, 0, '', referenceFile, filingCabinet.references
  );
}

/**
 * Reads all references in a component sub-directory.
 * @param {string} componentDir - The path of the component sub-directory.
 * @param {number} level - The level depth compared to the components directory.
 * @param {string} levelPath - The base URL of the component sub-directory.
 * @param {string} referenceFile - The name of the reference files.
 * @param {ReferenceDrawer} referenceDrawer - The reference storage.
 */
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

'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var logger = require( './../utilities/logger.js' );

/**
 * Reads all controls, including engine's predefined controls.
 * @param {string} controlPath - The path of the controls directory.
 * @param {FilingCabinet} filingCabinet - The file manager object.
 */
function readControls( controlPath, filingCabinet ) {

  logger.showInfo( '*** Reading controls...' );

  // Initialize the store - engine controls.
  logger.showInfo( 'Engine controls:' );
  getControls(
    '/node_modules/md-site-engine/controls',
    '',
    filingCabinet.controls
  );

  // Initialize the store - user controls.
  logger.showInfo( 'Site controls:' );
  getControls(
    controlPath,
    '',
    filingCabinet.controls
  );
}

/**
 * Reads all controls from a sub-directory.
 * @param {string} controlPath - The path of the control sub-directory.
 * @param {string} levelPath - The base URL of the sub-directory.
 * @param {ControlDrawer} controlDrawer - The control storage.
 */
function getControls( controlPath, levelPath, controlDrawer ) {

  var typeName = 'Control';

  // Read directory items.
  var directoryPath = path.join( process.cwd(), controlPath );
  var items = fs.readdirSync( directoryPath );

  items.forEach( function ( item ) {

    var itemPath = path.join( controlPath, item );
    var filePath = path.join( process.cwd(), itemPath );

    // Get item info.
    var stats = fs.statSync( filePath );

    if (stats.isDirectory()) {

      // Get sub level controls.
      getControls( itemPath, path.join( levelPath, item ), controlDrawer );
    }
    else if (stats.isFile() && path.extname( item ) === '.js') {

      // Read and store the JavaScript file.
      var controlKey = path.join( levelPath, path.basename( item, '.js' ) );
      controlDrawer.add( controlKey, require( filePath ) );
      logger.fileProcessed( typeName, itemPath );
    }
    else
      logger.fileSkipped( typeName, itemPath );
  } )
}

module.exports = readControls;

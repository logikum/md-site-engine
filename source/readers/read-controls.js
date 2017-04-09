'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var logger = require( './../utilities/logger.js' );

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

function getControls( folderPath, levelPath, controlDrawer ) {

  var typeName = 'Control';

  // Read directory items.
  var directoryPath = path.join( process.cwd(), folderPath );
  var items = fs.readdirSync( directoryPath );

  items.forEach( function ( item ) {

    var itemPath = path.join( folderPath, item );
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

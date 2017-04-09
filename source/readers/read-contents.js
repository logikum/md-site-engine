'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var logger = require( './../utilities/logger.js' );
var processContents = require( './process-contents.js' );

function readContents( contentPath, submenuFile, filingCabinet, renderer ) {

  var typeName = 'Content';
  logger.showInfo( '*** Reading contents...' );

  // Read directory items in the content store.
  var items = fs.readdirSync( path.join( process.cwd(), contentPath ) );

  items.forEach( function ( item ) {

    var itemPath = path.join( contentPath, item );

    // Get item info.
    var stats = fs.statSync( path.join( process.cwd(), itemPath ) );

    if (stats.isDirectory()) {

      // Create new stores for the language.
      var contentStock = filingCabinet.contents.create( item );
      var menuStock = filingCabinet.menus.create( item );

      // Save the language for the menu.
      filingCabinet.languages.push( item );
      logger.localeFound( typeName, item );

      // Find and add contents for the language.
      processContents(
        item,                       // language
        itemPath,                   // content directory
        '',                         // content root
        submenuFile,                // submenu filename
        contentStock,               // content stock
        menuStock,                  // menu stock
        filingCabinet.references,   // reference drawer
        renderer                    // markdown renderer
      );
    } else
      // Unused file.
      logger.fileSkipped( typeName, itemPath );
  } )
}

module.exports = readContents;

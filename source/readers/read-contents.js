'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var logger = require( './../utilities/logger.js' );
var processContents = require( './process-contents.js' );

/**
 * Read all contents.
 * @param {string} contentPath - The path of the contents directory.
 * @param {string} submenuFile - The path of the menu level file (__submenu.txt).
 * @param {FilingCabinet} filingCabinet - The file manager object.
 * @param {marked.Renderer} renderer - The custom markdown renderer.
 */
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

      if (item.endsWith( '--' )) {
        // Skip this content.
        logger.contentSkipped( item.substring( 0, item.length - 2 ) );
      }
       else {
        // Create new stores for the language.
        var contentStock = filingCabinet.contents.create( item );
        var menuStock = filingCabinet.menus.create( item );

        // Save the language for the menu.
        filingCabinet.languages.push( item );
        logger.localeFound( typeName, item );

        // Find and add contents for the language.
        processContents(
          itemPath,                   // content directory
          '',                         // content root
          submenuFile,                // submenu filename
          contentStock,               // content stock
          menuStock,                  // menu stock
          filingCabinet.references,   // reference drawer
          item,                       // language
          renderer                    // markdown renderer
        );
      }
    } else
      // Unused file.
      logger.fileSkipped( typeName, itemPath );
  } )
}

module.exports = readContents;

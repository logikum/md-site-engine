'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var getDefinition = require( './get-definition.js' );
var logger = require( './../utilities/logger.js' );

/**
 * Helper object to build menu tree.
 * @constructor
 */
var MenuBuilder = function () { };

/**
 * Creates a menu node in the menu tree.
 * @param {MenuStock} menuStock - The menu level storage.
 * @param {string} itemPath - The path of the menu level file (__submenu.txt).
 * @param {string} contentPath The base URL of the current level.
 */
MenuBuilder.buildSubMenu = function( menuStock, itemPath, contentPath ) {

  // Try to get sub-menu info.
  try {
    // Get item info.
    var filePath = path.join( process.cwd(), itemPath );
    var stats = fs.statSync( filePath );

    if (stats && stats.isFile()) {
      var content = { };

      // Read sub-menu info.
      content.html = fs.readFileSync( filePath, { encoding: 'utf8' } );

      // Read definition.
      var definition = getDefinition( content );

      // Create sub-menu item.
      return this.createMenuItem( menuStock, definition, contentPath, true );
    }
  } catch (err) {
    console.log( err.message );
  }
};

/**
 * Creates a menu leaf on the current menu node.
 * @param {MenuStock} menuStock - The current menu node (a menu level storage).
 * @param {Metadata} definition - The metadata object of the current content.
 * @param {string} contentPath - The path of the current content.
 * @param {Boolean} isDirectory - Does the current content a subdirectory?
 */
MenuBuilder.createMenuItem = function( menuStock, definition, contentPath, isDirectory ) {

  // Default values for item properties,
  var order = parseInt( definition.order || 1, 10 );
  var text = definition.text || '-?-';
  var umbel = definition.umbel && definition.umbel.toLowerCase() === 'true';
  if (isNaN( order )) {
    order = 0;
    text = '* ' + text;
  }
  var hidden = definition.hidden && definition.hidden.toLowerCase() === 'true';

  if (isDirectory) {

    // Add sub-menu item.
    return menuStock.branch( text, order, contentPath, hidden );
  }
  // Omit hidden item.
  else {

    // Add menu item.
    var path = contentPath;
    var length = path.length;

    if (length >= 6 && path.substr( -6 ) === '/index') {
      // Cut down closing index.
      var end = length > 6 ? 6 : 5;
      path = path.substr( 0, length - end );
    }

    // Store menu item.
    menuStock.add( text, order, path, hidden, umbel );
    logger.menuAdded( path );
  }
};

module.exports = MenuBuilder;

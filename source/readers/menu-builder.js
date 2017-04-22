'use strict';

var fs = require( 'fs' );
var path = require( 'path' );
var getDefinition = require( './get-definition.js' );
var logger = require( './../utilities/logger.js' );

var MenuBuilder = function () { };

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
  else if (!hidden) {
    // Add menu item.
    var path = contentPath;
    var length = path.length;

    if (length >= 6 && path.substr( -6 ) === '/index') {
      // Cut down closing index.
      var end = length > 6 ? 6 : 5;
      path = path.substr( 0, length - end );
    }
    // Store menu item.
    menuStock.add( text, order, path, umbel );
    logger.menuAdded( path );
  }
};

module.exports = MenuBuilder;

'use strict';

var util = require('util');
var MenuProto = require( './menu-proto.js' );

/**
 * Represents an item in the menu tree.
 * @param {number} id - The identifier of the menu item.
 * @param {string} text - The text of the menu item.
 * @param {number} order - The order of the menu item.
 * @param {string} path - The path of the menu item.
 * @param {Boolean} hidden - Indicates whether the menu item is shown.
 * @param {Boolean} umbel - Indicates whether the menu item is umbrella for more items.
 * @constructor
 */
var MenuItem = function( id, text, order, path, hidden, umbel ) {

  MenuProto.call( this, id, text, order, hidden );

  /**
   * Gets the paths of the menu node.
   * @type {string}
   */
  this.paths = createPathList( path );

  /**
   * Gets whether the menu item is umbrella for more items.
   * @type {MenuStock}
   */
  this.umbel = umbel;
};

util.inherits( MenuItem, MenuProto );

function createPathList( path ) {
  var paths = [ path ];

  // Add optional alternate paths.
  var length = path.length;
  if (length >= 6 && path.substr( -6 ) === '/index') {
    paths.push( path.substr( 0, length - 5 ) );
    paths.push( path.substr( 0, length - 6 ) );
  }
  return paths;
}

/**
 * Determines if the menu item is on the branch of the current path.
 * @param {string} baseUrl - The current path.
 * @returns {Boolean} True when the menu item is active; otherwise false.
 */
MenuItem.prototype.isActive = function( baseUrl ) {
  var self = this;
  baseUrl = baseUrl || '';

  return this.paths.some( function ( path ) {
    if (self.umbel === true)
      return path === baseUrl.substring( 0, path.length );
    else
      return path === baseUrl;
  } );
};

module.exports = MenuItem;

'use strict';

var util = require( 'util' );

var ID = 0;

/**
 * Represents a menu store of one language.
 * @constructor
 */
var MenuStock = function () { };

util.inherits( MenuStock, Array );

//region Prototype methods

/**
 * Stores a menu item.
 * @param {string} text - The text of the menu item.
 * @param {number} order - The order of the menu item.
 * @param {string} path - The path of the menu item.
 * @param {Boolean} umbel - Indicates whether the menu item is umbrella for more items.
 */
MenuStock.prototype.add = function( text, order, path, umbel ) {

  // Create menu item.
  var menuItem = {
    id: ++ID,
    text: text,
    order: order,
    paths: [ path ],
    umbel: umbel || false
  };

  // Add optional alternate paths.
  var length = path.length;
  if (length >= 6 && path.substr( -6 ) === '/index') {
    menuItem.paths.push( path.substr( 0, length - 5 ) );
    menuItem.paths.push( path.substr( 0, length - 6 ) );
    //menuItem.isNode = true;
  }

  // Add function to determine if menu item is active.
  menuItem.isActive = function ( baseUrl ) {
    var self = this;
    baseUrl = baseUrl || '';
    return this.paths.some( function ( path ) {
      if (self.umbel === true)
        return path === baseUrl.substring( 0, path.length );
      else
        return path === baseUrl;
    } );
  };

  // Store the menu item.
  this.push( menuItem );
};

/**
 * Creates and returns a new menu node.
 * @param {string} text - The text of the menu node.
 * @param {number} order - The order of the menu node.
 * @param {string} path - The path of the menu node.
 * @param {Boolean} hidden - Indicates whether the menu node is shown.
 * @returns {{id: number, text: *, order: *, path: *, hidden: *, children: MenuStock}}
 */
MenuStock.prototype.branch = function( text, order, path, hidden ) {

  // Create sub-menu item.
  var menuItem = {
    id: ++ID,
    text: text,
    order: order,
    path: path,
    hidden: hidden,
    children: new MenuStock()
  };

  // Add function to determine if sub-menu item is active.
  menuItem.isActive = function ( baseUrl ) {
    return this.children.some( function ( item ) {
      return item.isActive( baseUrl );
    } );
  };

  // Store the sub-menu item.
  this.push( menuItem );

  // Pass back the sub-menu item.
  return menuItem;
};

//endregion

//region Validation

/**
 * Makes final steps on the menus:
 *    * Sort and freeze menus.
 * @returns {Array} The sorted and frozen menus.
 */
MenuStock.prototype.finalize = function() {

  var menu = [ ];

  // Sort and freeze child menus.
  this.forEach( function( item ) {
    if (item.children)
      item.children = item.children.finalize();
  } );

  // Sort menu items.
  this.sort( function ( a, b ) {
    if (a.order < b.order)
      return -1;
    if (a.order > b.order)
      return 1;
    return 0;
  } ).forEach( function( item ) {
    menu.push( item );
  } );

  // Helper method to find a menu item with the required path.
  menu.findItem = function( path ) {
    return findItem( path, this );
  };

  // Helper method to find a menu node with the required path.
  menu.findNode = function( path ) {
    return findNode( path, this );
  };

  // Immutable object.
  Object.freeze( menu );

  // Return the sorted and frozen menu array.
  return menu;
};

function findItem( path, items ) {
  var result = null;
  items.forEach( function ( item ) {
    if (!result && item.paths && item.paths.filter( function( value ) {
        return value === path;
      } ).length > 0)
      result = item;
    if (!result && item.children) {
      var child = findItem( path, item.children );
      if (child)
        result = child;
    }
  } );
  return result;
}

function findNode( path, items ) {
  var result = null;
  items.forEach( function ( item ) {
    if (!result && item.path === path)
      result = item;
    if (!result && item.children) {
      var child = findNode( path, item.children );
      if (child)
        result = child;
    }
  } );
  return result;
}

//endregion

module.exports = MenuStock;

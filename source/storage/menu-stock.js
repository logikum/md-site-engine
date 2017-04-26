'use strict';

var util = require( 'util' );
var MenuItem = require( './../models/menu-item.js' );
var MenuNode = require( './../models/menu-node.js' );
var MenuTree = require( './../models/menu-tree.js' );
var freeze = require( './../utilities/freeze.js' );

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
 * @param {Boolean} hidden - Indicates whether the menu item is shown.
 * @param {Boolean} umbel - Indicates whether the menu item is umbrella for more items.
 */
MenuStock.prototype.add = function( text, order, path, hidden, umbel ) {

  // Create menu item.
  var menuItem = new MenuItem( ++ID, text, order, path, hidden, umbel || false );

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
  var menuItem = new MenuNode( ++ID, text, order, path, hidden, new MenuStock() );

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

  var tree = new MenuTree();

  // Sort and freeze child menus.
  this.forEach( function( item ) {
    if (item instanceof MenuNode)
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
    tree.push( item );
  } );

  // Immutable object.
  freeze( tree );

  // Return the sorted and frozen menu array.
  return tree;
};

//endregion

module.exports = MenuStock;

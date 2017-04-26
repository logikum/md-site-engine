'use strict';

var util = require('util');
var MenuItem = require( './menu-item.js' );
var MenuNode = require( './menu-node.js' );

/**
 * Represents a menu tree.
 * @constructor
 */
var MenuTree = function() {

};

util.inherits(MenuTree, Array);

/**
 * Finds the menu item that has the required path.
 * @param {string} path - The path of the menu item.
 * @returns {MenuItem|undefined} The requested menu item.
 */
MenuTree.prototype.findItem = function( path ) {
  return findItem( path, this );
};

/**
 * Finds the menu node that has the required path.
 * @param {string} path - The path of the menu node.
 * @returns {MenuNode|undefined} The requested menu node.
 */
MenuTree.prototype.findNode = function( path ) {
  return findNode( path, this );
};

/**
 * Determines if menu element is an item.
 * @param {MenuItem|MenuNode} element
 * @returns {Boolean} True when the element is an item; otherwise false.
 */
MenuTree.prototype.isItem = function( element ) {
  return element instanceof MenuItem;
};

/**
 * Determines if menu element is a node.
 * @param {MenuItem|MenuNode} element
 * @returns {Boolean} True when the element is a node; otherwise false.
 */
MenuTree.prototype.isNode = function( element ) {
  return element instanceof MenuNode;
};

//region Helper methods

function findItem( path, items ) {
  var result = null;
  items.forEach( function ( item ) {
    if (!result && item instanceof MenuItem && item.paths.filter( function( value ) {
        return value === path;
      } ).length > 0)
      result = item;
    if (!result && item instanceof MenuNode) {
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
    if (!result && item instanceof MenuNode) {
      var child = findNode( path, item.children );
      if (child)
        result = child;
    }
  } );
  return result;
}

//endregion

module.exports = MenuTree;

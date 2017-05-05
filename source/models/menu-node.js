'use strict';

var util = require('util');
var MenuProto = require( './menu-proto.js' );

/**
 * Represents a node in the menu tree.
 * @param {number} id - The identifier of the menu node.
 * @param {string} text - The text of the menu node.
 * @param {number} order - The order of the menu node.
 * @param {string} path - The path of the menu node.
 * @param {Boolean} hidden - Indicates whether the node item is shown.
 * @param {MenuStock} children - The child items of the menu node
 * @constructor
 */
var MenuNode = function( id, text, order, path, hidden, children ) {

  MenuProto.call( this, id, text, order, hidden );

  /**
   * Gets the path of the menu node.
   * @type {string}
   */
  this.path = path;

  /**
   * Gets the child items of the menu node.
   * @type {MenuStock}
   */
  this.children = children;
};

util.inherits( MenuNode, MenuProto );

/**
 * Determines if the sub-menu is on the branch of the current path.
 * @param {string} url - The current path.
 * @returns {Boolean} True when the sub-menu is active; otherwise false.
 */
MenuNode.prototype.isActive = function ( url ) {

  return this.children.some( function ( item ) {
    return item.isActive( url );
  } );
};

module.exports = MenuNode;

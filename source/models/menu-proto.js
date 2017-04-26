'use strict';

/**
 * Represents the prototype of menu elements.
 * @param {number} id - The identifier of the menu element.
 * @param {string} text - The text of the menu element.
 * @param {number} order - The order of the menu element.
 * @param {Boolean} hidden - Indicates whether the menu element is shown.
 * @constructor
 */
var MenuProto = function( id, text, order, hidden ) {

  /**
   * Gets the identifier of the menu element.
   * @type {number}
   */
  this.id = id;

  /**
   * Gets the text of the menu element.
   * @type {string}
   */
  this.text =  text;

  /**
   * Gets the order of the menu element.
   * @type {number}
   */
  this.order = order;

  /**
   * Gets whether the menu element is shown.
   * @type {Boolean}
   */
  this.hidden = hidden;
};

module.exports = MenuProto;

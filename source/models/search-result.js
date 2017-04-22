'use strict';

/**
 * Represents a hit in the results of a search.
 * @param {Metadata} definition - The metadata of the current path.
 * @param {number} priority - The priority of the hit.
 * @constructor
 */
var SearchResult = function( definition, priority ) {

  /**
   * Gets the title of the content.
   * @type {string}
   * @readonly
   */
  this.title = definition.title || definition.path;

  /**
   * Gets the description of the content.
   * @type {string}
   * @readonly
   */
  this.description = definition.description;

  /**
   * Gets the path of the content.
   * @type {string}
   * @readonly
   */
  this.path = definition.path;

  /**
   * Gets the priority of the hit.
   * @type {number}
   * @readonly
   */
  this.priority = priority;

  Object.freeze( this );
};

module.exports = SearchResult;

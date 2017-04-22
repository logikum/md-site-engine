'use strict';

var freeze = require( './../utilities/freeze.js' );

function getMainProperties( definitions ) {
  var main = { };

  // Collect the non-segment properties from definitions.
  for (var property in definitions) {
    if (property.indexOf( '$-' ) !== 0 && property.indexOf( 'segment.' ) !== 0)
      main[ property ] = definitions[ property ];
  }
  return main;
}

function getSegmentProperties( definitions ) {
  var segments = { };

  // Collect the segment properties from definitions.
  for (var property in definitions) {
    if (property.indexOf( '$-') === 0)
      segments[ property.substring( 2 ) ] = definitions[ property ];
    if (property.indexOf( 'segment.') === 0)
      segments[ property.substring( 8 ) ] = definitions[ property ];
  }
  return segments;
}

/**
 * Represents the metadata of a content.
 * @param {object} definitions - A collection of properties.
 * @param {string} path - The path of the current content.
 * @constructor
 */
var Metadata = function( definitions, path ) {

  //region Search engine properties

  /**
   * Gets the title of the document.
   * @type {string}
   * @readonly
   */
  this.title = '';

  /**
   * Gets the keywords of the document.
   * @type {string}
   * @readonly
   */
  this.keywords = '';

  /**
   * Gets the description of the document.
   * @type {string}
   * @readonly
   */
  this.description = '';

  //endregion

  //region Menu properties

  /**
   * Gets the text of the menu item.
   * @type {string}
   * @readonly
   */
  this.text = '';

  /**
   * Gets the order of the menu item.
   * @type {string}
   * @readonly
   */
  this.order = 0;

  /**
   * Indicates whether the menu item is displayed.
   * @type {Boolean}
   * @readonly
   */
  this.hidden = false;

  /**
   * Indicates whether the menu item is a leaf with hidden children,
   * i.e. a truncated menu node.
   * @type {Boolean}
   * @readonly
   */
  this.umbel = false;

  //endregion

  //region Page properties

  /**
   * Gets the identifier of the content, it defaults to the path.
   * @type {string}
   * @readonly
   */
  this.id = '';

  /**
   * Gets the path of the content.
   * @type {string}
   * @readonly
   */
  this.path = path;

  /**
   * Gets the name of a custom document for the content.
   * @type {string}
   * @readonly
   */
  this.document = '';

  /**
   * Gets the name of a custom layout for the content.
   * @type {string}
   * @readonly
   */
  this.layout = '';

  /**
   * Gets the token collection for the segments found on the content.
   * @type {object}
   * @readonly
   */
  this.segments = { };

  /**
   * Indicates whether the content is enabled for search.
   * @type {Boolean}
   * @readonly
   */
  this.searchable = true;

  //endregion

  // Set the defined properties of the content.
  Object.assign( this, getMainProperties( definitions ) );
  Object.assign( this.segments, getSegmentProperties( definitions ) );

  // Set default identity.
  if (!this.id)
    this.id = path;

  // Immutable object.
  freeze( this );
};

module.exports = Metadata;

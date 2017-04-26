'use strict';

var ROOT = null;
var LIST = '-list-';
var SHOW = '-show-';

function getListPaths() {
  return {
    languages: ROOT + LIST + 'languages',
    documents: ROOT + LIST + 'documents',
    layouts: ROOT + LIST + 'layouts',
    segments: ROOT + LIST + 'segments',
    contents: ROOT + LIST + 'contents',
    menus: ROOT + LIST + 'menus',
    locales: ROOT + LIST + 'locales',
    references: ROOT + LIST + 'references',
    controls: ROOT + LIST + 'controls'
  };
}

function getShowPaths() {
  return {
    //language: ROOT + SHOW + 'language',
    document: ROOT + SHOW + 'document',
    layout: ROOT + SHOW + 'layout',
    segment: ROOT + SHOW + 'segment',
    content: ROOT + SHOW + 'content',
    menu: ROOT + SHOW + 'menu',
    //locale: ROOT + SHOW + 'locale',
    reference: ROOT + SHOW + 'reference',
    control: ROOT + SHOW + 'control'
  };
}

/**
 * Provides the paths of the resources for the development support.
 */
var PATH = {

  /**
   * Gets the home page of the resources.
   */
  root: ROOT,

  /**
   * Returns the paths of the resource listings.
   */
  list: getListPaths(),
  /**
   * Returns the paths of the resource details.
   */
  show: getShowPaths(),

  /**
   * Compounds the resource paths based on the root value.
   * @param {string} root - The base URL of all resources.
   */
  init: function ( root ) {
    ROOT = root;
    this.root = root;
    this.list = getListPaths();
    this.show = getShowPaths();
  },
  /**
   * Returns the URL friendly version of a path.
   * @param {string} path - The path to encode.
   * @returns {string} The encoded path.
   */
  safe: function( path ) {
    return path.replace( /\//g, '~' );
  },
  /**
   * Returns the oroginal version of an URL friendly path.
   * @param {string} path - The path to decode.
   * @returns {string} The decoded path.
   */
  unsafe: function( path ) {
    return path.replace( /~/g, '/' );
  }
};

module.exports = PATH;

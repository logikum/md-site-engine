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

var PATH = {

  root: ROOT,
  list: getListPaths(),
  show: getShowPaths(),

  init: function ( root ) {
    ROOT = root;
    this.root = root;
    this.list = getListPaths();
    this.show = getShowPaths();
  },
  safe: function( path ) {
    return path.replace( /\//g, '~' );
  },
  unsafe: function( path ) {
    return path.replace( /~/g, '/' );
  }
};

module.exports = PATH;

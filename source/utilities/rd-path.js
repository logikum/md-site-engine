'use strict';

var ROOT = '/r&d';
var LIST = '-list-';
var SHOW = '-show-';

var RDPath = {

  root: ROOT,
  list: {
    languages: ROOT + LIST + 'languages',
    documents: ROOT + LIST + 'documents',
    layouts: ROOT + LIST + 'layouts',
    segments: ROOT + LIST + 'segments',
    contents: ROOT + LIST + 'contents',
    menus: ROOT + LIST + 'menus',
    locales: ROOT + LIST + 'locales',
    references: ROOT + LIST + 'references',
    controls: ROOT + LIST + 'controls'
  },
  show: {
    //language: ROOT + SHOW + 'language',
    document: ROOT + SHOW + 'document',
    layout: ROOT + SHOW + 'layout',
    segment: ROOT + SHOW + 'segment',
    content: ROOT + SHOW + 'content',
    menu: ROOT + SHOW + 'menu',
    //locale: ROOT + SHOW + 'locale',
    reference: ROOT + SHOW + 'reference',
    control: ROOT + SHOW + 'control'
  },

  safe: function( path ) {
    return path.replace( /\//g, '~' );
  },
  unsafe: function( path ) {
    return path.replace( /~/g, '/' );
  }
};

module.exports = RDPath;

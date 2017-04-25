'use strict';

var MenuStock = require( './menu-stock.js' );

/**
 * Represents a storage for menus.
 * @constructor
 */
var MenuDrawer = function() {

  var menus = { };

  //region Methods

  /**
   * Creates and returns a new menu store for a language.
   * @param {string} language - The language of the store.
   * @returns {MenuStock} The content store of the language.
   */
  this.create = function ( language ) {

    // Create a menu stock for the language.
    menus[ language ] = new MenuStock();

    // Return the menu stock created.
    return menus[ language ];
  };

  /**
   * Returns the menu store of the requested language.
   * @param {string} language - The language of the menus.
   * @returns {MenuStock} The requested menu object.
   */
  this.get = function ( language ) {

    return menus[ language ];
  };

  //endregion

  //region Validation

  /**
   * Makes final steps on the menus:
   *    * Sort and freeze menus.
   */
  this.finalize = function() {

    // Replace menu stocks with sorted and frozen menu arrays.
    for (var language in menus) {
      menus[ language ] = menus[ language ].finalize();
    }
  };

  //endregion

  //region Developer methods

  function listArray( stock, language, itemPath, menuPath ) {
    var list = '';

    stock.forEach( function( menuItem ) {
      var itemText = (menuPath ? menuPath + ' ● ' : '') +
        '[' + menuItem.order + '] ' + menuItem.text;
      var itemUrl = itemPath + '/' + language + '/' + menuItem.id;
      list += '<li><a href="' + itemUrl + '"' +
        (menuItem.hidden ? ' style="text-decoration: line-through;"' : '') +
        '>' + itemText + '</a></li>\n';
      if (menuItem.children)
        list += listArray( menuItem.children, language, itemPath, itemText );
    });
    return list;
  }

  /**
   * Returns the list of the menus.
   * @param {string} itemPath - The base URL of the details page.
   * @returns {string} The list of the menus in HTML format.
   */
  this.list = function ( itemPath ) {
    var list = '';

    for (var key in menus) {
      list += '<h3>' + key + '</h3>\n';
      //list += menus[ key ].list( key, itemPath );
      list += '<ul>\n';
      list += listArray( menus[ key ], key, itemPath, '' );
      list += '</ul>\n';
    }
    return list;
  };

  function findItem( stock, id ) {
    return stock.reduce( function( item, menuItem ) {
      return item ||
        (menuItem.id === id ? menuItem : null) ||
        (menuItem.children ? findItem( menuItem.children, id ) : null);
    }, null );
  }

  /**
   * Returns the details of a menu.
   * @param {string} language - The language of the menu.
   * @param {string} key - The path of the menu.
   * @returns {{list: string, title}} The details of the menu in HTML format.
   */
  this.show = function ( language, key ) {

    var list = '<ul>\n';
    var menuItem = findItem( menus[ language ], key );

    for (var attr in menuItem) {
      if (attr === 'isActive')
        list += '<li><b>' + attr + '</b>: ' + menuItem[ attr ]() + '</li>\n';
      else if (attr === 'children') {
        var texts = menuItem[ attr ].map( function ( menuItem ) {
          return menuItem.text;
        }, [] );
        //list += '<li><b>' + attr + '</b>: ' + texts.join(' ● ') + '</li>\n';
        list += '<li><b>' + attr + '</b>:</li>\n';
        list += '<ul>\n';
        texts.forEach( function( text ) {
          list += '<li>' + text + '</li>\n';
        } );
        list += '</ul>\n';
      }
      else
        list += '<li><b>' + attr + '</b>: ' + menuItem[ attr ] + '</li>\n';
    }
    list += '</ul>\n';

    return {
      list: list,
      title: menuItem.text
    };
  };

  //endregion
};

module.exports = MenuDrawer;

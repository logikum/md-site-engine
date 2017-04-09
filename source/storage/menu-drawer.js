'use strict';

var MenuStock = require( './menu-stock.js' );

var MenuDrawer = function() {

  var menus = { };

  this.create = function ( language ) {

    // Create a menu stock for the language.
    menus[ language ] = new MenuStock();

    // Return the menu stock created.
    return menus[ language ];
  };

  this.get = function ( language ) {

    return menus[ language ];
  };


  //region Validation

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
      var itemText = (menuPath ? menuPath + ' ● ' : '') + menuItem.text;
      var itemUrl = itemPath + '/' + language + '/' + menuItem.id;
      list += '<li><a href="' + itemUrl + '">' + itemText + '</a></li>\n';
      if (menuItem.children)
        list += listArray( menuItem.children, language, itemPath, itemText );
    });
    return list;
  }

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

  // this.show = function ( language, key ) {
  //   return menus[ language ].show( key );
  // };

  function findItem( stock, id ) {
    return stock.reduce( function( item, menuItem ) {
      return item ||
        (menuItem.id === id ? menuItem : null) ||
        (menuItem.children ? findItem( menuItem.children, id ) : null);
    }, null );
  }

  this.show = function ( language, key ) {
    var menuItem = findItem( menus[ language ], key );

    var list = '<ul>\n';
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

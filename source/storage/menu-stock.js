'use strict';

var util = require( 'util' );

var ID = 0;

var MenuStock = function () { };

util.inherits( MenuStock, Array );

MenuStock.prototype.add = function( text, order, path, umbel ) {

  // Create menu item.
  var menuItem = {
    id: ++ID,
    text: text,
    order: order,
    paths: [ path ],
    umbel: umbel || false
  };

  // Add optional alternate paths.
  var length = path.length;
  if (length >= 6 && path.substr( -6 ) === '/index') {
    menuItem.paths.push( path.substr( 0, length - 5 ) );
    menuItem.paths.push( path.substr( 0, length - 6 ) );
    //menuItem.isNode = true;
  }

  // Add function to determine if menu item is active.
  menuItem.isActive = function ( baseUrl ) {
    var self = this;
    return this.paths.some( function ( path ) {
      if (self.umbel === true)
        return path === baseUrl.substring( 0, path.length );
      else
        return path === baseUrl;
    } );
  };

  // Store the menu item.
  this.push( menuItem );
};

MenuStock.prototype.branch = function( text, order, hidden ) {

  // Create sub-menu item.
  var menuItem = {
    id: ++ID,
    text: text,
    order: order,
    hidden: hidden,
    children: new MenuStock()
  };

  // Add function to determine if sub-menu item is active.
  menuItem.isActive = function ( baseUrl ) {
    return this.children.some( function ( item ) {
      return item.isActive( baseUrl );
    } );
  };

  // Store the sub-menu item.
  this.push( menuItem );

  // Pass back the sub-menu item.
  return menuItem;
};

//region Validation

MenuStock.prototype.finalize = function() {

  var menu = [ ];

  // Sort and freeze child menus.
  this.forEach( function( item ) {
    if (item.children)
      item.children = item.children.finalize();
  } );

  // Sort menu items.
  this.sort( function ( a, b ) {
    if (a.order < b.order)
      return -1;
    if (a.order > b.order)
      return 1;
    return 0;
  } ).forEach( function( item ) {
    menu.push( item );
  });

  // Immutable object.
  Object.freeze( menu );

  // Return the sorted and frozen menu array.
  return menu;
};

//endregion

//region Developer methods

// function listStock( stock, language, itemPath, menuPath ) {
//
//   var list = '';
//   stock.forEach( function( menuItem ) {
//     var itemText = (menuPath ? menuPath + ' ● ' : '') + menuItem.text;
//     var itemUrl = itemPath + '/' + language + '/' + menuItem.id;
//     list += '<li><a href="' + itemUrl + '">' + itemText + '</a></li>\n';
//     if (menuItem.children)
//       list += listStock( menuItem.children, language, itemPath, itemText );
//   });
//   return list;
// }
//
// MenuStock.prototype.list = function ( language, itemPath ) {
//   var list = '<ul>\n';
//   list += listStock( this, language, itemPath, '' );
//   return list + '</ul>\n';
// };
//
// function findItem( stock, id ) {
//   return stock.reduce( function( item, menuItem ) {
//     return item ||
//       (menuItem.id === id ? menuItem : null) ||
//       (menuItem.children ? findItem( menuItem.children, id ) : null);
//   }, null );
// }
//
// MenuStock.prototype.show = function ( key ) {
//   var menuItem = findItem( this, key );
//
//   var list = '<ul>\n';
//   for (var attr in menuItem) {
//     if (attr === 'isActive')
//       list += '<li><b>' + attr + '</b>: ' + menuItem[ attr ]() + '</li>\n';
//     else if (attr === 'children') {
//       var texts = menuItem[ attr ].map( function ( menuItem ) {
//         return menuItem.text;
//       }, [] );
//       //list += '<li><b>' + attr + '</b>: ' + texts.join(' ● ') + '</li>\n';
//       list += '<li><b>' + attr + '</b>:</li>\n';
//       list += '<ul>\n';
//       texts.forEach( function( text ) {
//         list += '<li>' + text + '</li>\n';
//       } );
//       list += '</ul>\n';
//     }
//     else
//       list += '<li><b>' + attr + '</b>: ' + menuItem[ attr ] + '</li>\n';
//   }
//   list += '</ul>\n';
//
//   return {
//     list: list,
//     title: menuItem.text
//   };
// };

//endregion

module.exports = MenuStock;

'use strict';

var util = require( 'util' );

var MenuStore = function () { };

util.inherits( MenuStore, Array );

MenuStore.prototype.add = function ( text, order, path, umbel ) {

  // Create menu item.
  var menuItem = {
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

MenuStore.prototype.branch = function ( text, order, hidden ) {

  // Create sub-menu item.
  var menuItem = {
    text: text,
    order: order,
    hidden: hidden,
    children: new MenuStore()
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

module.exports = MenuStore;

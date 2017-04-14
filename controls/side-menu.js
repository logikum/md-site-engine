'use strict';

var chevron = '<span class="glyphicon glyphicon-chevron-right pull-right" style="margin-top: 2px"></span>';

function getSideMenu( ctx ) {
  var menu = '';

  var root = ctx.metadata[ 'side-menu-root' ];
  var header = ctx.metadata[ 'side-menu-header' ];
  var top = ctx.metadata[ 'side-menu-top' ];
  var depth = ctx.metadata[ 'side-menu-depth' ] || 1;

  if (root) {
    var rootItem = findMenuRoot( root, ctx.menus );
    if (rootItem) {

      if (header)
        menu += '<h4 class="side-menu">' + header + '</h4>';

      menu += '<ul class="side-menu">\n';
      if (top) {
        var topItem = findMenuTop( root, ctx.menus );
        if (topItem) {
          // Separator?
          if (topItem.text === '---')
            menu += '  <li class="divider"></li>';
          // Active menu line?
          else if (topItem.paths[ 0 ] === ctx.baseUrl)
            menu += '  <li class="active"><a href="' + topItem.paths[ 0 ] + '">' +
              chevron + top + '</a></li>\n';
          // Menu line.
          else
            menu += '  <li><a href="' + topItem.paths[ 0 ] + '">' + top + '</a></li>\n';
        }
      }
      menu += getMenuItems( ctx, rootItem.children, depth, 0 );
      menu += '</ul>\n';
    }
  }
  return menu;
}

function findMenuRoot( root, items ) {
  var result;
  items.forEach( function ( item ) {
    if (!result && item.path === root)
      result = item;
    if (!result && item.children) {
      var child = findMenuRoot( root, item.children );
      if (child)
        result = child;
    }
  } );
  return result;
}

function findMenuTop( root, items ) {
  var result;
  items.forEach( function ( item ) {
    if (!result && item.paths && item.paths.filter( function( path ) {
        return path === root;
      } ).length > 0)
      result = item;
    if (!result && item.children) {
      var child = findMenuTop( root, item.children );
      if (child)
        result = child;
    }
  } );
  return result;
}

function getMenuItems( ctx, items, depth, level ) {
  var indent = '  ';
  for (var i = 0; i < level; i++) {
    indent += '    ';
  }
  var menu = '';
  items.forEach( function ( item ) {
    if (item.paths) {
      // Separator?
      if (item.text === '---')
        menu += indent + '<li class="divider"></li>';
      // Active menu line?
      else if (item.isActive( ctx.baseUrl ))
        menu += indent + '<li class="active"><a href="' + item.paths[ 0 ] + '">' +
          chevron + item.text + '</a></li>\n';
      // Menu line.
      else
        menu += indent + '<li><a href="' + item.paths[ 0 ] + '">' + item.text + '</a></li>\n';
    } else if (level < depth && !item.hidden) {
      // Sub-menu.
      menu += indent + '<li>\n';
      menu += indent + '  <ul>\n';
      menu += getMenuItems( ctx, item.children, depth, level + 1 );
      menu += indent + '  </ul>\n';
      menu += indent + '</li>\n';
    }
  } );
  return menu;
}

module.exports = getSideMenu;

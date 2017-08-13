'use strict';

var chevron = '<span class="glyphicon glyphicon-chevron-right pull-right" style="margin-top: 2px"></span>';

function getSideMenu( ctx ) {
  var menu = '';

  // Get side-menu attributes.
  var root = ctx.metadata[ 'side-menu-root' ];
  var header = ctx.metadata[ 'side-menu-header' ];
  var top = ctx.metadata[ 'side-menu-top' ];
  var depth = ctx.metadata[ 'side-menu-depth' ] || 1;
  var activeFound = false;

  if (root) {
    var rootItem = ctx.menus.findNode( root );
    if (rootItem) {

      // Add required header.
      if (header)
        menu += '<h4 class="side-menu">' + ctx.t( header, header ) + '</h4>';

      menu += '<ul class="side-menu">\n';
      if (top) {

        // Add required parent item.
        var topItem = ctx.menus.findItem( root );
        if (topItem && !topItem.hidden) {
          top = ctx.t( top, top );

          // Separator?
          if (topItem.text === '---')
            menu += '  <li class="divider"></li>';

          // Active menu line?
          else if (topItem.paths[ 0 ] === ctx.url) {
            menu += '  <li class="active">' + chevron + top + '</li>\n';
            activeFound = true;
          }
          // Menu line.
          else
            menu += '  <li><a href="' + topItem.paths[ 0 ] + '">' + top + '</a></li>\n';
        }
      }
      // Add menu items and sub-menus.
      menu += getMenuItems( ctx, rootItem.children, depth, 0, activeFound );
      menu += '</ul>\n';
    }
  }
  return menu;
}

function getMenuItems( ctx, items, depth, level, activeFound ) {
  var indent = '  ';
  for (var i = 0; i < level; i++) {
    indent += '    ';
  }
  var menu = '';
  items.forEach( function ( item ) {
    if (item.paths && !item.hidden) {

      // Separator?
      if (item.text === '---')
        menu += indent + '<li class="divider"></li>';

      // Active menu line?
      else if (item.isActive( ctx.url ) && !activeFound) {
        menu += indent + '<li class="active">' + chevron + item.text + '</li>\n';
        activeFound = true;
      }

      // Menu line.
      else
        menu += indent + '<li><a href="' + item.paths[ 0 ] + '">' + item.text + '</a></li>\n';
    }
    else if (level < depth - 1 && item.children) {

      // Sub-menu.
      menu += indent + '  <ul>\n';
      menu += getMenuItems( ctx, item.children, depth, level + 1, activeFound );
      menu += indent + '  </ul>\n';
    }
  } );
  return menu;
}

module.exports = getSideMenu;

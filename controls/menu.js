'use strict';

function getMenu( ctx ) {
  var menu = '';
  menu += '<ul class="nav navbar-nav">\n';
  menu += getMenuItems( ctx, ctx.menus );
  menu += '</ul>\n';
  menu += '<ul class="nav navbar-nav navbar-right">\n';
  menu += getLanguageItems( ctx );
  menu += '</ul>\n';
  return menu;
}

function getMenuItems( ctx, items ) {
  var menu = '';
  items.forEach( function ( item ) {
    if (item.paths) {
      if (item.text === '---')
      // Separator:
        menu += '<li class="divider"></li>';
      else
      // Menu line:
        menu += '<li' + (item.isActive( ctx.baseUrl ) ? ' class="active"' : '') +
          '><a href="' + item.paths[ 0 ] + '">' + item.text + '</a></li>\n';
    } else if (!item.hidden) {
      // Menu node:
      menu += '<li class="dropdown' + (item.isActive( ctx.baseUrl ) ? ' active' : '') + '">\n';
      menu += '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">' +
        item.text + ' <span class="caret"></span></a>\n';
      menu += '<ul class="dropdown-menu" role="menu">\n';
      menu += getMenuItems( ctx, item.children );
      menu += '</ul>\n';
      menu += '</li>\n';
    }
  } );
  return menu;
}

function getLanguageItems( ctx ) {

  function nameOf( item ) {
    return ctx.config.locale[ item ] || item;
  }

  function linkOf( item ) {
    return '<li><a href="/set-language/' + item + '?id=' + ctx.baseUrl + '">' + nameOf( item ) + '</a></li>\n';
  }

  if (ctx.languages.length > 1) {

    // Dropdown list of selectable languages.
    var list = '<li class="dropdown">\n';
    list += '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">' +
      nameOf( ctx.language ) + ' <span class="caret"></span></a>\n';
    list += '<ul class="dropdown-menu" role="menu">\n';
    ctx.languages.forEach( function ( lang ) {
      if (lang !== ctx.language)
        list += linkOf( lang );
    } );
    list += '</ul>\n';
    list += '</li>\n';
    return list;

//} else if (ctx.languages.length == 2) {
//
//  // Link to alternate language.
//  var lang = ctx.languages[0] === ctx.language ? ctx.languages[1] : ctx.languages[0];
//  return linkOf( lang );

  } else
  // No language selection.
    return '';
}

module.exports = getMenu;

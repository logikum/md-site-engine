'use strict';

function getNavbar( ctx ) {
  var navbar = '';
  navbar += '<ul class="nav navbar-nav">\n';
  navbar += getNavbarItems( ctx, ctx.menus );
  navbar += '</ul>\n';
  navbar += '<ul class="nav navbar-nav navbar-right">\n';
  navbar += getLanguageItems( ctx );
  navbar += '</ul>\n';
  if (ctx.config.searchInNavbar)
    navbar += getSearchField( ctx );
  return navbar;
}

function getNavbarItems( ctx, items ) {
  var menu = '';
  items.forEach( function ( item ) {
    if (!item.hidden) {
      if (ctx.menus.isItem( item ) /*item.paths*/) {
        if (item.text === '---')
        // Separator:
          menu += '<li class="divider"></li>';
        else
        // Navbar line:
          menu += '<li' + (item.isActive( ctx.url ) ? ' class="active"' : '') +
            '><a href="' + item.paths[ 0 ] + '">' + item.text + '</a></li>\n';
      } else {
        // Navbar node:
        menu += '<li class="dropdown' + (item.isActive( ctx.url ) ? ' active' : '') + '">\n';
        menu += '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">' +
          item.text + ' <span class="caret"></span></a>\n';
        menu += '<ul class="dropdown-menu" role="menu">\n';
        menu += getNavbarItems( ctx, item.children );
        menu += '</ul>\n';
        menu += '</li>\n';
      }
    }
  } );
  return menu;
}

function getSearchField( ctx ) {
  return ctx.searchPath
    ?
    '<form class="navbar-form navbar-right navbar-input-group" action="' + ctx.searchPath + '" method="post">\n' +
    '  <div class="form-group">\n' +
    '    <input type="text" class="form-control" name="text2search"\n' +
    '           maxlength="13" placeholder="' + ctx.t('searchHint') + '">\n' +
    '  </div>\n' +
    '  <button type="submit" class="btn btn-default" id="btnSearch" disabled="disabled">\n' +
    '    <span class="glyphicon glyphicon-search" aria-hidden="true"></span>\n' +
    '  </button>\n' +
    '</form>\n'
    :
    '';
}

function getLanguageItems( ctx ) {

  function nameOf( item ) {
    return ctx.config.locale[ item ] || item;
  }

  function linkOf( item ) {
    return '<li><a href="/set-language/' + item + '?id=' + ctx.url + '">' + nameOf( item ) + '</a></li>\n';
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

module.exports = getNavbar;

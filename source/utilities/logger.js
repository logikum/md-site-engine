'use strict';

var colors = require( 'colors/safe' );

colors.setTheme({
  locale: 'blue',
  processed: 'green',
  skipped: 'magenta',
  menu: 'cyan',
  info: 'blue',
  warning: 'magenta',
  error: 'red'
});

var log = {
  localeFound: function ( typeName, locale ) {
    console.log( colors.locale( '%s locale: %s' ), typeName, locale );
  },
  fileProcessed: function ( typeName, fileName ) {
    console.log( colors.processed( '%s processed: %s' ), typeName, fileName );
  },
  fileSkipped: function ( typeName, fileName ) {
    console.log( colors.skipped( '%s skipped: %s' ), typeName, fileName );
  },
  menuAdded: function ( menuPath ) {
    console.log( colors.menu( 'Menu item added: %s' ), menuPath );
  },
  showInfo: function ( message ) {
    console.log( colors.info( message ) );
  },
  showWarning: function ( message ) {
    console.log( colors.warning( message ) );
  },
  showError: function ( message ) {
    console.log( colors.error( message ) );
  }
};

module.exports = log;



'use strict';

var path = require( 'path' );

var ContextFactory = require( './context-factory.js' );
var ControlDrawer = require( './storage/control-drawer.js' );
var ReferenceDrawer = require( './storage/reference-drawer.js' );
var DocumentDrawer = require( './storage/document-drawer.js' );
var LayoutDrawer = require( './storage/layout-drawer.js' );
var SegmentDrawer = require( './storage/segment-drawer.js' );
var LocaleDrawer = require( './storage/locale-drawer.js' );
var ContentDrawer = require( './storage/content-drawer.js' );
var MenuDrawer = require( './storage/menu-drawer.js' );

var FilingCabinet = function( config ) {

  var self = this;
  this.controls = new ControlDrawer();

  this.references = new ReferenceDrawer( config.referenceFile );
  this.documents = new DocumentDrawer();
  this.layouts = new LayoutDrawer();
  this.segments = new SegmentDrawer();
  this.locales = new LocaleDrawer( config.defaultLocale );

  this.contents = new ContentDrawer( config.defaultLocale );
  this.menus = new MenuDrawer();
  this.languages = [ ];

  var contextFactory = new ContextFactory( config, this );

  //region Public methods

  this.get = function ( language, baseUrl ) {

    // Get the meta data of the content.
    var definition = self.contents.getDefinition( language, baseUrl );

    // Create context for the controls.
    var context = contextFactory.create( language, baseUrl, definition );

    function insertSegments( component ) {
      var response = component.text;

      // Replace the tokens with their texts.
      component.tokens.forEach( function( token ) {
        var textToInsert;

        if (token.isControl) {
          // Determine the path of the control.
          var controlKey = definition.segments[ token.name ] || token.name;
          // Get the control.
          var control = self.controls.get( controlKey );
          // Call the control to get its text.
          textToInsert = control( context );
        }
        else if (token.name === config.layoutSegment) {
          // Determine the path of the layout.
          var layoutKey = definition[ token.name ] || token.name;
          // Get the layout object.
          var layout = self.layouts.get( language, layoutKey );
          // Get the text of the layout.
          textToInsert = insertSegments( layout );
        }
        else if (token.name === config.contentSegment) {
          // Get the content object.
          var content = self.contents.getContent( language, baseUrl );
          // Get the text of the content.
          textToInsert = insertSegments( content );
        }
        else {
          // Determine the path of the segment.
          var segmentKey = definition.segments[ token.name ] || token.name;
          // Check if segment is replaced by a control.
          if (segmentKey[ 0 ] === '#'){
            // Determine the path of the control.
            var proxyKey = segmentKey.substr( 1 );
            // Get the control.
            var proxyControl = self.controls.get( proxyKey );
            // Call the control to get its text.
            textToInsert = proxyControl( context );
          } else {
            // Get the segment object.
            var segment = self.segments.get( language, segmentKey );
            // Get the text of the segment.
            textToInsert = insertSegments( segment );
          }
        }

        // Insert the result of the token into the component.
        var re = new RegExp( token.expression.replace( /\{/g, '\\{' ), 'g' );
        response = response.replace( re, textToInsert );
      } );

      // Return the processed text of the component.
      return response;
    }

    // Determine the path of the document.
    var documentKey = definition[ 'document' ] ||
      path.basename( config.documentFile, path.extname( config.documentFile ) );
    // Get the document object.
    var document = self.documents.get( language, documentKey );

    // Return the processed text of the document.
    return insertSegments( document );
  };

  this.getLocalizedPath = function( curLanguage, baseUrl, newLanguage ) {

    return self.contents.getLocalizedPath( curLanguage, baseUrl, newLanguage );
  };

  //endregion

  //region Validation

  this.finalize = function() {
    self.segments.finalize(
      self.controls, self.languages
    );
    self.layouts.finalize(
      self.segments, self.controls, self.languages, config.contentSegment
    );
    self.documents.finalize(
      self.segments, self.controls, self.languages, config.layoutSegment
    );
    self.contents.finalize(
      self.segments, self.controls
    );

    // Immutable objects.
    self.menus.finalize();
    Object.freeze( self.languages );
  };

  //endregion

  //region Developer methods

  this.listLanguages = function() {
    var list = '<ul>\n';
    self.languages.forEach( function( language ) {
      list += '<li>' + language + '</li>\n';
    });
    return list + '</ul>\n';
  };

  //endregion
};

module.exports = FilingCabinet;

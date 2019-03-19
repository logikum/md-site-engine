'use strict';

var path = require( 'path' );

var ControlDrawer = require( './storage/control-drawer.js' );
var ReferenceDrawer = require( './storage/reference-drawer.js' );
var DocumentDrawer = require( './storage/document-drawer.js' );
var LayoutDrawer = require( './storage/layout-drawer.js' );
var SegmentDrawer = require( './storage/segment-drawer.js' );
var LocaleDrawer = require( './storage/locale-drawer.js' );
var ContentDrawer = require( './storage/content-drawer.js' );
var MenuDrawer = require( './storage/menu-drawer.js' );
var escapeRegExp = require( './utilities/escape-reg-exp.js' );

/**
 * Manages and processes the files of the site.
 * @param {Configuration} config - The configuration object.
 * @constructor
 */
var FilingCabinet = function( config ) {

  var self = this;

  //region Public properties

  /**
   * Gets or sets the storage of the controls.
   * @type {ControlDrawer}
   */
  this.controls = new ControlDrawer();

  /**
   * Gets or sets the storage of the references.
   * @type {ReferenceDrawer}
   */
  this.references = new ReferenceDrawer( config.referenceFile );
  /**
   * Gets or sets the storage of the documents.
   * @type {DocumentDrawer}
   */
  this.documents = new DocumentDrawer();
  /**
   * Gets or sets the storage of the layouts.
   * @type {LayoutDrawer}
   */
  this.layouts = new LayoutDrawer();
  /**
   * Gets or sets the storage of the segments.
   * @type {SegmentDrawer}
   */
  this.segments = new SegmentDrawer();
  /**
   * Gets or sets the storage of the locales.
   * @type {LocaleDrawer}
   */
  this.locales = new LocaleDrawer( config.defaultLocale );

  /**
   * Gets or sets the storage of the contents.
   * @type {ContentDrawer}
   */
  this.contents = new ContentDrawer(
    config.defaultLocale, config.paths.notFound, config.paths.search
  );
  /**
   * Gets or sets the storage of the menus.
   * @type {MenuDrawer}
   */
  this.menus = new MenuDrawer();
  /**
   * Gets or sets the list of the languages.
   * @type {Array.<string>}
   */
  this.languages = [ ];
  /**
   * Gets or sets the text to search.
   * @type {string}
   */
  this.text2search = '';

  //endregion

  //region Public methods

  /**
   * Gets the content of the path in the specified language.
   * @param {string} language - The language of the requested content.
   * @param {string} url - The request URL string.
   * @param {Context} context - The context of the request.
   * @returns {string} The html text of the content.
   */
  this.get = function ( language, url, context ) {

    function insertSegments( component ) {
      var response = component.html;

      // Replace the tokens with their texts.
      component.tokens.forEach( function( token ) {
        var textToInsert;

        if (token.isControl) {
          // Determine the path of the control.
          var controlKey = context.metadata.segments[ token.name ] || token.name;
          // Get the control.
          var control = self.controls.get( controlKey );
          // Call the control to get its text.
          textToInsert = control( context );
        }
        else if (token.isData) {
          textToInsert = '';
          // Get the required data property.
          var dataProperty = context.data[ token.name ];
          if (dataProperty)
            // Convert the value of the data property to text.
            textToInsert = dataProperty.toString();
        }
        else if (token.name === config.layoutSegment) {
          // Determine the path of the layout.
          var layoutKey = context.metadata[ token.name ] || token.name;
          // Get the layout object.
          var layout = self.layouts.get( language, layoutKey );
          // Get the text of the layout.
          textToInsert = insertSegments( layout );
        }
        else if (token.name === config.contentSegment) {
          // Get the content object.
          var content = self.contents.getContent( language, url );
          // Get the text of the content.
          textToInsert = insertSegments( content );
          // Mark highlighted texts.
          if (context.data.highlight) {
            var rehl = new RegExp( escapeRegExp( context.data.highlight ), 'gi' );
            textToInsert = textToInsert.replace( rehl, '<mark>$&</mark>' );
          }        }
        else {
          // Determine the path of the segment.
          var segmentKey = context.metadata.segments[ token.name ] || token.name;
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
    var documentKey = context.metadata[ 'document' ] ||
      path.basename( config.documentFile, path.extname( config.documentFile ) );
    // Get the document object.
    var document = self.documents.get( language, documentKey );

    // Return the processed text of the document.
    return insertSegments( document );
  };

  /**
   * Gets the same path for another language.
   * @param {string} curLanguage - The current language.
   * @param {string} baseUrl - The path in the current language.
   * @param {string} newLanguage - The language of the requested path.
   */
  this.getLocalizedPath = function( curLanguage, baseUrl, newLanguage ) {

    return self.contents.getLocalizedPath( curLanguage, baseUrl, newLanguage );
  };

  //endregion

  //region Validation

  /**
   * Validates the processed file contents.
   */
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

  /**
   * Lists the processed languages.
   * @returns {string} The HTML output to render.
   */
  this.listLanguages = function() {
    var list = '<ul>\n';
    var languages = [ ...self.languages ];
    languages
      .sort()
      .forEach( function( language ) {
        list += '<li>' + language + '</li>\n';
      });
    return list + '</ul>\n';
  };

  //endregion
};

module.exports = FilingCabinet;

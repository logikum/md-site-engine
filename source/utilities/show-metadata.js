'use strict';

var showMetadata = function( metadata ) {

  var list = '<h3>Metadata</h3>\n';
  var i = 0;
  list += '<ul>\n';
  for (var item in metadata) {
    if (i === 0)
      list += '<li class="list-item-group">Search engine properties:</li>\n';
    if (i === 3)
      list += '<li class="list-item-group">Menu properties:</li>\n';
    if (i === 7)
      list += '<li class="list-item-group">Page properties:</li>\n';
    if (i === 12)
      list += '<li class="list-item-group">Custom properties:</li>\n';

    if (item === 'segments') {
      list += '<li><b>' + item + '</b>:</li>\n';
      var segments = metadata[ item ];

      list += '<ul>\n';
      for (var segment in segments) {
        list += '<li><strong>' + segment + '</strong>: ' + segments[ segment ] + '</li>\n';
      }
      list += '</ul>\n';
    }
    else
      list += '<li><b>' + item + '</b>: ' + metadata[ item ] + '</li>\n';
    i++;
  }
  return list + '</ul>\n';
};

module.exports = showMetadata;

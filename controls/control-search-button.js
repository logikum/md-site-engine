'use strict';

function controlSearchButton( ctx ) {
  return ctx.searchPath ?
    '\n' +
    '<script>\n' +
    '  (function() {\n' +
    '    $("#text2search").keyup(function() {\n' +
    '      var empty = false;\n' +
    '      if ($(this).val().length < 3)\n' +
    '        empty = true;\n' +
    '      if (empty)\n' +
    '        $("#btnSearch").attr("disabled", "disabled");\n' +
    '      else\n' +
    '        $("#btnSearch").removeAttr("disabled");\n' +
    '    });\n' +
    '  })()\n' +
    '</script>\n' +
    '\n'
    :
    '';
}

module.exports = controlSearchButton;

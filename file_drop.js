/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

ace.define(
  "file_drop",
  ["require", "exports", "module", "ace/config", "ace/lib/event", "ace/ext/modelist", "ace/editor"],
  function (require, exports, module) {

    var config = require("ace/config");
    var event = require("ace/lib/event");
    var modelist = require("ace/ext/modelist");

    module.exports = function (editor) {
      event.addListener(editor.container, "dragover", function (e) {
        var types = e.dataTransfer.types;
        if (types && Array.prototype.indexOf.call(types, 'Files') !== -1)
          return event.preventDefault(e);
      });

      event.addListener(editor.container, "drop", function (e) {
        var file;
        try {
          file = e.dataTransfer.files[0];
          if (window.FileReader) {
            var reader = new FileReader();
            reader.onload = function () {
              var mode = modelist.getModeForPath(file.name);
              editor.session.doc.setValue(reader.result);
              editor.session.setMode(mode.mode);
              editor.session.modeName = mode.name;
            };
            reader.readAsText(file);
          }
          return event.preventDefault(e);
        } catch (err) {
          return event.stopEvent(e);
        }
      });
    };

    var Editor = require("ace/editor").Editor;
    config.defineOptions(Editor.prototype, "editor", {
      loadDroppedFile: {
        set: function () { module.exports(this); },
        value: true
      }
    });

  });

ace.define("ace/ext/modelist", ["require", "exports", "module"], function (require, exports, module) {
  "use strict";

  var modes = [];
  function getModeForPath(path) {
    var mode = modesByName.text;
    var fileName = path.split(/[\/\\]/).pop();
    for (var i = 0; i < modes.length; i++) {
      if (modes[i].supportsFile(fileName)) {
        mode = modes[i];
        break;
      }
    }
    return mode;
  }

  var Mode = function (name, caption, extensions) {
    this.name = name;
    this.caption = caption;
    this.mode = "ace/mode/" + name;
    this.extensions = extensions;
    var re;
    if (/\^/.test(extensions)) {
      re = extensions.replace(/\|(\^)?/g, function (a, b) {
        return "$|" + (b ? "^" : "^.*\\.");
      }) + "$";
    } else {
      re = "^.*\\.(" + extensions + ")$";
    }

    this.extRe = new RegExp(re, "gi");
  };

  Mode.prototype.supportsFile = function (filename) {
    return filename.match(this.extRe);
  };
  var supportedModes = {
    ABAP: ["abap"],
    ABC: ["abc"],
    ActionScript: ["as"],
    ADA: ["ada|adb"],
    Apache_Conf: ["^htaccess|^htgroups|^htpasswd|^conf|htaccess|htgroups|htpasswd"],
    AsciiDoc: ["asciidoc|adoc"],
    Assembly_x86: ["asm|a"],
    AutoHotKey: ["ahk"],
    BatchFile: ["bat|cmd"],
    Bro: ["bro"],
    C_Cpp: ["cpp|c|cc|cxx|h|hh|hpp|ino"],
    C9Search: ["c9search_results"],
    Cirru: ["cirru|cr"],
    Clojure: ["clj|cljs"],
    Cobol: ["CBL|COB"],
    coffee: ["coffee|cf|cson|^Cakefile"],
    ColdFusion: ["cfm"],
    CSharp: ["cs"],
    Csound_Document: ["csd"],
    Csound_Orchestra: ["orc"],
    Csound_Score: ["sco"],
    CSS: ["css"],
    Curly: ["curly"],
    D: ["d|di"],
    Dart: ["dart"],
    Diff: ["diff|patch"],
    Dockerfile: ["^Dockerfile"],
    Dot: ["dot"],
    Drools: ["drl"],
    Edifact: ["edi"],
    Eiffel: ["e|ge"],
    EJS: ["ejs"],
    Elixir: ["ex|exs"],
    Elm: ["elm"],
    Erlang: ["erl|hrl"],
    Forth: ["frt|fs|ldr|fth|4th"],
    Fortran: ["f|f90"],
    FTL: ["ftl"],
    Gcode: ["gcode"],
    Gherkin: ["feature"],
    Gitignore: ["^.gitignore"],
    Glsl: ["glsl|frag|vert"],
    Gobstones: ["gbs"],
    golang: ["go"],
    GraphQLSchema: ["gql"],
    Groovy: ["groovy"],
    HAML: ["haml"],
    Handlebars: ["hbs|handlebars|tpl|mustache"],
    Haskell: ["hs"],
    Haskell_Cabal: ["cabal"],
    haXe: ["hx"],
    Hjson: ["hjson"],
    HTML: ["html|htm|xhtml|vue|we|wpy"],
    HTML_Elixir: ["eex|html.eex"],
    HTML_Ruby: ["erb|rhtml|html.erb"],
    INI: ["ini|conf|cfg|prefs"],
    Io: ["io"],
    Jack: ["jack"],
    Jade: ["jade|pug"],
    Java: ["java"],
    JavaScript: ["js|jsm|jsx"],
    JSON: ["json"],
    JSONiq: ["jq"],
    JSP: ["jsp"],
    JSSM: ["jssm|jssm_state"],
    JSX: ["jsx"],
    Julia: ["jl"],
    Kotlin: ["kt|kts"],
    LaTeX: ["tex|latex|ltx|bib"],
    LESS: ["less"],
    Liquid: ["liquid"],
    Lisp: ["lisp"],
    LiveScript: ["ls"],
    LogiQL: ["logic|lql"],
    LSL: ["lsl"],
    Lua: ["lua"],
    LuaPage: ["lp"],
    Lucene: ["lucene"],
    Makefile: ["^Makefile|^GNUmakefile|^makefile|^OCamlMakefile|make"],
    Markdown: ["md|markdown"],
    Mask: ["mask"],
    MATLAB: ["matlab"],
    Maze: ["mz"],
    MEL: ["mel"],
    MIXAL: ["mixal"],
    MUSHCode: ["mc|mush"],
    MySQL: ["mysql"],
    Nix: ["nix"],
    NSIS: ["nsi|nsh"],
    ObjectiveC: ["m|mm"],
    OCaml: ["ml|mli"],
    Pascal: ["pas|p"],
    Perl: ["pl|pm"],
    pgSQL: ["pgsql"],
    PHP: ["php|phtml|shtml|php3|php4|php5|phps|phpt|aw|ctp|module"],
    Pig: ["pig"],
    Powershell: ["ps1"],
    Praat: ["praat|praatscript|psc|proc"],
    Prolog: ["plg|prolog"],
    Properties: ["properties"],
    Protobuf: ["proto"],
    Python: ["py"],
    R: ["r"],
    Razor: ["cshtml|asp"],
    RDoc: ["Rd"],
    Red: ["red|reds"],
    RHTML: ["Rhtml"],
    RST: ["rst"],
    Ruby: ["rb|ru|gemspec|rake|^Guardfile|^Rakefile|^Gemfile"],
    Rust: ["rs"],
    SASS: ["sass"],
    SCAD: ["scad"],
    Scala: ["scala"],
    Scheme: ["scm|sm|rkt|oak|scheme"],
    SCSS: ["scss"],
    SH: ["sh|bash|^.bashrc"],
    SJS: ["sjs"],
    Smarty: ["smarty|tpl"],
    snippets: ["snippets"],
    Soy_Template: ["soy"],
    Space: ["space"],
    SQL: ["sql"],
    SQLServer: ["sqlserver"],
    Stylus: ["styl|stylus"],
    SVG: ["svg"],
    Swift: ["swift"],
    Tcl: ["tcl"],
    Tex: ["tex"],
    Text: ["txt"],
    Textile: ["textile"],
    Toml: ["toml"],
    TSX: ["tsx"],
    Twig: ["twig|swig"],
    Typescript: ["ts|typescript|str"],
    Vala: ["vala"],
    VBScript: ["vbs|vb"],
    Velocity: ["vm"],
    Verilog: ["v|vh|sv|svh"],
    VHDL: ["vhd|vhdl"],
    Wollok: ["wlk|wpgm|wtest"],
    XML: ["xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl|xaml"],
    XQuery: ["xq"],
    YAML: ["yaml|yml"],
    Django: ["html"]
  };

  var nameOverrides = {
    ObjectiveC: "Objective-C",
    CSharp: "C#",
    golang: "Go",
    C_Cpp: "C and C++",
    Csound_Document: "Csound Document",
    Csound_Orchestra: "Csound",
    Csound_Score: "Csound Score",
    coffee: "CoffeeScript",
    HTML_Ruby: "HTML (Ruby)",
    HTML_Elixir: "HTML (Elixir)",
    FTL: "FreeMarker"
  };
  var modesByName = {};
  for (var name in supportedModes) {
    var data = supportedModes[name];
    var displayName = (nameOverrides[name] || name).replace(/_/g, " ");
    var filename = name.toLowerCase();
    var mode = new Mode(filename, displayName, data[0]);
    modesByName[filename] = mode;
    modes.push(mode);
  }

  module.exports = {
    getModeForPath: getModeForPath,
    modes: modes,
    modesByName: modesByName
  };

});
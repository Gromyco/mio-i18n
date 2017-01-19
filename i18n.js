// i18n Middleware
// Created for MIO server | www.MakeItOnce.net
// Author: Julius Gromyko | juliusgromyko@gmail.com
// Julius Gromyko (C) 2017

var fs = require("fs");
var path = require("path");

// Base Configs
var localesPath = path.join(require('path').dirname(require.main.filename),'i18n');
var defaultLocale = "en";
var locales = [];

// Init module
function init(options){
  if(options){
    if(options.path){
      localesPath = path.join(require('path').dirname(require.main.filename),options.path);
    };

    if(options.defaultLocale){
      defaultLocale = options.defaultLocale;
    };
  };

  // Load locales
  var files = fs.readdirSync(localesPath);
  for (var i = 0; i < files.length; i++) {
    if(path.extname(files[i])==".json"){
      var locale = path.parse(files[i]).name;
      locales[locale] = JSON.parse(fs.readFileSync(path.join(localesPath, files[i])));
    };
  };

  // Export var
  return {
    get: get,
    middleware: middleware
  }
};

// Get Locale
function middleware(req, res, next){
  var rawLang = req.headers["accept-language"];
  var lang = defaultLocale;
  if(rawLang){
    lang = rawLang.split(";")[0].substring(0,2);
  };
  if(!locales[lang]){
    lang = defaultLocale;
  };
  req.__ = get;
  req.lang = lang;

  return next();
};

// Get String By Key
function _fillVars(line, vars){
  if(line && vars && vars.length){
    for (var i = 0; i < vars.length; i++) {
      line = line.replace("@"+(i+1),vars[i]);
    };
  };

  return line;
};
function get(key, defaultValue, vars, locale){
  if(!locale && this && this.lang){
    locale = this.lang;
  };

  if(key){
    var locale = locale || defaultLocale;
    if(!locales[locale]){
      locale = defaultLocale;
    };
    if(locales[locale]){
      var _rawKey = key.split(".")
      if(locales[locale][_rawKey[0]]){
        var chunk = locales[locale][_rawKey[0]];
        for (var i = 1; i < _rawKey.length; i++) {
          if(chunk[_rawKey[i]]){
            chunk = chunk[_rawKey[i]];
          }else{
            return _fillVars(defaultValue, vars) || key || "";
          };
        };
        return _fillVars(chunk, vars);
      };
    };
  };

  return _fillVars(defaultValue, vars) || key || "";
};

// Export
module.exports=init;

# MIO i18n Middleware

i18n middleware for Node.js.

# Quick Start

1) Create i18n files folder
2) Put translations to that folder and rename them to "LocalName.json" form

# Sample
var i18n = require('mio-i18n')({path: "i18n", defaultLocale: "en"});

console.log(i18n.get("hello.world.name", "Not Found", ["John"]));
console.log(i18n.get("wrong.path", "Not Found @1", ["Field!"]));
console.log(i18n.get("wrong.path2"));
console.log(i18n.get());


# Using with express
var i18n = require('../../open-source/mio-i18n/i18n')();
...
app.use(i18n.middleware);
...
req.__('text to translate','default text', vars);

'use strict';

const nunjucks = require('nunjucks');
const chamber = require('./chamber');

const relative_path = '_src/html/templates/';
const absolute_path = __dirname + '/_src/html/templates/';

function installExpressApp(app) {
  nunjucks.configure( chamber.paths['html'] , {
    autoescape: true,
    express: app
  });
}

/* --- Functions --- */

function UserField_DOM(field) {
  return nunjucks.render('templates/UserField.html', { field });
}

/* --- Exports --- */

module.exports = {
  installExpressApp,
  UserField_DOM
}

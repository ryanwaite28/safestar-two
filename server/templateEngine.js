'use strict';

const nunjucks = require('nunjucks');
const chamber = require('./chamber');

function installExpressApp(app) {
  nunjucks.configure( chamber.paths['html'] , {
    autoescape: true,
    express: app
  });
}

/* --- Functions --- */

function UserField_DOM(user_field) {
  return nunjucks.render('templates/UserField.html', { user_field });
}

function UserAsset_DOM(user_asset) {
  return nunjucks.render('templates/UserAsset.html', { user_asset });
}

function UserEntity_DOM(user_asset) {
  return nunjucks.render('templates/UserEntity.html', { user_asset });
}

function AssetField_DOM(asset_field) {
  return nunjucks.render('templates/AssetField.html', { asset_field });
}

function EntityField_DOM(asset_field) {
  return nunjucks.render('templates/EntityField.html', { asset_field });
}

/* --- Exports --- */

module.exports = {
  installExpressApp,
  UserField_DOM,
  UserAsset_DOM,
  UserEntity_DOM,
  AssetField_DOM,
  EntityField_DOM
}

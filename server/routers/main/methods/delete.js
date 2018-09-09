'use strict';

const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../../../models').models;
const chamber = require('../../../chamber');
const templateEngine = require('../../../templateEngine');
const google = require('../../../firebase_config/index');



/* --- DELETE Functions --- */



function delete_entity_field(request, response) {
  let { entity_field_id } = request.body;
  if(!chamber.validateInteger(entity_field_id)) {
    return response.json({ error: true, message: '"entity_field_id" is required; must be integer/number' });
  }
  models.EntityFields.destroy({where: {id: entity_field_id, user_id: request.session.you.id}})
  .then(res => {
    return response.json({ res, message: 'Entity Field Deleted!' });
  })
  .catch(error => {
    console.log('error', error);
    return response.json({ error: true, message: 'Could not delete entity field...' });
  });
}

function delete_user_entity(request, response) {
  let { entity_id } = request.body;
  if(!chamber.validateInteger(entity_id)) {
    return response.json({ error: true, message: '"entity_id" is required; must be integer/number' });
  }
  models.Entities.destroy({where: {id: entity_id, user_id: request.session.you.id}})
  .then(res => {
    return response.json({ res, message: 'User Entity Deleted!' });
  })
  .catch(error => {
    console.log('error', error);
    return response.json({ error: true, message: 'Could not delete user entity...' });
  });
}

function delete_asset_field(request, response) {
  let { asset_field_id } = request.body;
  if(!chamber.validateInteger(asset_field_id)) {
    return response.json({ error: true, message: '"asset_field_id" is required; must be integer/number' });
  }
  models.AssetFields.destroy({where: {id: asset_field_id, user_id: request.session.you.id}})
  .then(res => {
    return response.json({ res, message: 'Asset Field Deleted!' });
  })
  .catch(error => {
    console.log('error', error);
    return response.json({ error: true, message: 'Could not delete asset field...' });
  });
}

function delete_user_asset(request, response) {
  let { asset_id } = request.body;
  if(!chamber.validateInteger(asset_id)) {
    return response.json({ error: true, message: '"asset_id" is required; must be integer/number' });
  }
  models.Assets.destroy({where: {id: asset_id, user_id: request.session.you.id}})
  .then(res => {
    return response.json({ res, message: 'User Asset Deleted!' });
  })
  .catch(error => {
    console.log('error', error);
    return response.json({ error: true, message: 'Could not delete user asset...' });
  });
}

function delete_user_field(request, response) {
  let { user_field_id } = request.body;
  if(!chamber.validateInteger(user_field_id)) {
    return response.json({ error: true, message: '"user_field_id" is required; must be integer/number' });
  }
  models.UserFields.destroy({where: {id: user_field_id, user_id: request.session.you.id}})
  .then(res => {
    return response.json({ res, message: 'User Field Deleted!' });
  })
  .catch(error => {
    console.log('error', error);
    return response.json({ error: true, message: 'Could not delete user field...' });
  });
}



/*  Exports  */

module.exports = {
  delete_user_field,
  delete_user_asset,
  delete_user_entity,
  delete_asset_field,
  delete_entity_field,
}

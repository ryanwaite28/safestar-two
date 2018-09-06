'use strict';

const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../../../models').models;
const chamber = require('../../../chamber');



/* --- GET Functions --- */

function welcome_api(request, response) {
  return response.json({ name: 'Safe Star API', online: true });
}





/* --- Exports --- */

module.exports = {
  welcome_api,
}

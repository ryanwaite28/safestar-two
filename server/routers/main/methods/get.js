'use strict';

const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../../../models').models;
const chamber = require('../../../chamber');
const templateEngine = require('../../../templateEngine');
const google = require('../../../firebase_config/index');



/* --- GET Functions --- */



/* Pages */

function welcome_page(request, response) {
  if(request.session.id) { return response.redirect('/account'); }
  return response.render(chamber.pages['welcome'], { signed_in: request.session.id || false });
}

function signup_page(request, response) {
  if(request.session.id) { return response.redirect('/account'); }
  return response.render(chamber.pages['signup'], { signed_in: request.session.id || false });
}

function signin_page(request, response) {
  if(request.session.id) { return response.redirect('/account'); }
  return response.render(chamber.pages['signin'], { signed_in: request.session.id || false });
}

function account_page(request, response) {
  return response.render(chamber.pages['account'], { signed_in: request.session.id || false });
}

function account_info_page(request, response) {
  return response.render(chamber.pages['account_info'], { signed_in: request.session.id || false });
}

function account_assets_page(request, response) {
  return response.render(chamber.pages['account_assets'], { signed_in: request.session.id || false });
}

/* AJAX */

function test_route(request, response) {
  return response.json({ message: 'admit one' });
}

function check_session(request, response) {
  (async function() {
    if(request.session.id && request.session.you){
      var get_user = await models.Users.findOne({ where: { id: request.session.you.id } });
      var user = get_user.dataValues;
      delete user['password'];
      var session_id = request.session.id;
      return response.json({ online: true, session_id, user });
    }
    else {
      return response.json({ online: false });
    }
  })()
}

function get_user_fields(request, response) {
  models.UserFields.findAll({where: {user_id: request.session.you.id}})
  .then(resp => {
    let list = (resp.map(i => i.get({plain: true}))).reduce(function(acc, cur){ cur.dom = templateEngine.UserField_DOM(cur); return acc.concat([cur]) }, [])
    return response.json({ user_fields: list });
  })
}



/* --- Exports --- */

module.exports = {
  welcome_page,
  signup_page,
  signin_page,
  account_page,
  account_info_page,
  account_assets_page,
  test_route,
  check_session,
  get_user_fields
}

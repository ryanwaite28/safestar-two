'use strict';

const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../../../models').models;
const chamber = require('../../../chamber');
const templateEngine = require('../../../templateEngine');
const google = require('../../../firebase_config/index');



/* --- PUT Functions --- */



function sign_in(request, response) {
  (async function() {
    if(request.session.id) { return response.json({ error: true, message: "Client already signed in" }) }
    let { email, password } = request.body;
    if(email) { email = email.toLowerCase(); }
    if(!email) {
      return response.json({ error: true, message: 'Email Address field is required' });
    }
    if(!chamber.validateEmail(email)) {
      return response.json({ error: true, message: 'Email is invalid' });
    }
    if(!password) {
      return response.json({ error: true, message: 'Password field is required' });
    }
    var check_account = await models.Users.findOne({ where: { email } });
    if(!check_account) {
      return response.json({ error: true, message: 'Invalid credentials.' });
    }
    if(bcrypt.compareSync(password, check_account.dataValues.password) === false) {
      return response.json({ error: true, message: 'Invalid credentials.' });
    }
    var user = check_account.dataValues;
    delete user['password'];
    request.session.id = chamber.uniqueValue();
    request.session.you = user;
    return response.json({ session_id: request.session.id, online: true, user, message: 'Signed In!' });
  })()
}

function sign_out(request, response) {
  request.session.reset();
  return response.json({ online: false, successful: true });
}


/*  Account Handlers  */

function update_icon(request, response) {
  let icon_image = request.files && request.files.icon_image || null;
  if(!icon_image) {
    return response.json({ error: true, message: 'no file with name \"icon_image\" found...' });
  }
  let allowed = ['jpeg', 'jpg', 'png'];
  let type = icon_image.mimetype.split('/')[1];
  if(!allowed.includes(type)) {
    return response.json({ error: true, message: 'invalid file type: jpg or png required...' });
  }
  google.upload_chain(icon_image, request.session.you.icon)
  .then(res => {
    console.log(res);
    models.Users.update({icon: res.link}, {where: { id: request.session.you.id }});
    request.session.you.icon = res.link;
    return response.json({ link: res.link, user: request.session.you, message: 'Icon updated!' });
  })
  .catch(err => {
    console.log('err', err);
    return response.json({ error: true, message: 'could not upload...' });
  });
}

function change_user_password(request, response) {
  let { old_password, new_password, new_password_verify } = request.body;
  if(!old_password) {
    return response.json({ error: true, message: 'Old Password field is required' });
  }
  if(!new_password) {
    return response.json({ error: true, message: 'New Password field is required' });
  }
  if(!new_password_verify) {
    return response.json({ error: true, message: 'New Password Confirmation field is required' });
  }
  if(!chamber.validatePassword(new_password)) {
    return response.json({
      error: true,
      message: 'New Password must be: at least 7 characters, upper and/or lower case alphanumeric'
    });
  }
  if(new_password !== new_password_verify) {
    return response.json({ error: true, message: 'New Passwords must match' });
  }
  models.Users.findOne({ where: { id: request.session.you.id } })
  .then(account => {
    if(bcrypt.compareSync(old_password, account.dataValues.password) === false) {
      return response.json({
        error: true,
        message: 'Old Password is incorrect'
      });
    }
    models.Users.update({ password: bcrypt.hashSync(new_password) }, { where: { id: request.session.you.id } })
    .then(resp => {
      return response.json({
        message: 'Password updated successfully!'
      });
    })
    .catch(err => {
      console.log('err', err);
      return response.json({ error: true, message: 'could not upload...' });
    });
  })
  .catch(err => {
    console.log('err', err);
    return response.json({ error: true, message: 'could not upload...' });
  });
}

function edit_entity_field(request, response) {
  let { entity_field_name, entity_field_value, entity_field_id } = request.body;
  if(!chamber.validateField(entity_field_name)) {
    return response.json({ error: true, message: '"entity_field_name" is required; must be only letters and numbers, 2-50 characters' });
  }
  if(!entity_field_value) {
    return response.json({ error: true, message: '"entity_field_value" is required' });
  }
  if(!chamber.validateInteger(entity_field_id)) {
    return response.json({ error: true, message: '"entity_field_id" is required; must be integer/number' });
  }
  models.EntityFields.update({ name: entity_field_name, value: entity_field_value }, {where: {id: entity_field_id, user_id: request.session.you.id}})
  .then(res => models.EntityFields.findOne({where: {id: entity_field_id, user_id: request.session.you.id}}))
  .then(af => {
    let data = af.dataValues;
    let obj = Object.assign({}, data, {dom: templateEngine.EntityField_DOM(data)});
    return response.json({ entity_field: obj, message: 'Entity Field Updated!' });
  })
  .catch(error => {
    console.log('error', error);
    return response.json({ error: true, message: 'Could not update entity field...' });
  });
}

function edit_user_entity(request, response) {
  let check = chamber.scanEntityForm(request.body.form_obj);
  if(!check.error) {
    return response.json({ error: true, message: check.message });
  }
  models.Entitys.update({ name: entity_name }, {where: {id: entity_id, user_id: request.session.you.id}})
  .then(res => models.Entitys.findOne({where: {id: entity_id, user_id: request.session.you.id}}))
  .then(ue => {
    let data = ue.dataValues;
    let obj = Object.assign({}, data, {dom: templateEngine.UserEntity_DOM(data)});
    return response.json({ user_entity: obj, message: 'User Entity Updated!' });
  })
  .catch(error => {
    console.log('error', error);
    return response.json({ error: true, message: 'Could not update user entity...' });
  });
}

function edit_asset_field(request, response) {
  let { asset_field_name, asset_field_value, asset_field_id } = request.body;
  if(!chamber.validateField(asset_field_name)) {
    return response.json({ error: true, message: '"asset_field_name" is required; must be only letters and numbers, 2-50 characters' });
  }
  if(!asset_field_value) {
    return response.json({ error: true, message: '"asset_field_value" is required' });
  }
  if(!chamber.validateInteger(asset_field_id)) {
    return response.json({ error: true, message: '"asset_field_id" is required; must be integer/number' });
  }
  models.AssetFields.update({ name: asset_field_name, value: asset_field_value }, {where: {id: asset_field_id, user_id: request.session.you.id}})
  .then(res => models.AssetFields.findOne({where: {id: asset_field_id, user_id: request.session.you.id}}))
  .then(af => {
    let data = af.dataValues;
    let obj = Object.assign({}, data, {dom: templateEngine.AssetField_DOM(data)});
    return response.json({ asset_field: obj, message: 'Asset Field Updated!' });
  })
  .catch(error => {
    console.log('error', error);
    return response.json({ error: true, message: 'Could not update asset field...' });
  });
}

function edit_user_asset(request, response) {
  let { asset_name, asset_id } = request.body;
  if(!chamber.validateAssetName(asset_name)) {
    return response.json({ error: true, message: 'New Asset Name field is required; must be only letters and numbers, 2-50 characters' });
  }
  if(!chamber.validateInteger(asset_id)) {
    return response.json({ error: true, message: '"asset_id" is required; must be integer/number' });
  }
  models.Assets.update({ name: asset_name }, {where: {id: asset_id, user_id: request.session.you.id}})
  .then(res => models.Assets.findOne({where: {id: asset_id, user_id: request.session.you.id}}))
  .then(ua => {
    let data = ua.dataValues;
    let obj = Object.assign({}, data, {dom: templateEngine.UserAsset_DOM(data)});
    return response.json({ user_asset: obj, message: 'User Asset Updated!' });
  })
  .catch(error => {
    console.log('error', error);
    return response.json({ error: true, message: 'Could not update user asset...' });
  });
}

function edit_user_field(request, response) {
  let { user_field_name, user_field_value, user_field_id } = request.body;
  console.log(request.body);
  if(!chamber.validateField(user_field_name)) {
    return response.json({ error: true, message: '"user_field_name" is required; must be only letters and numbers, 2-50 characters' });
  }
  if(!user_field_value) {
    return response.json({ error: true, message: '"user_field_value" is required' });
  }
  if(!chamber.validateInteger(user_field_id)) {
    return response.json({ error: true, message: '"user_field_id" is required; must be integer/number' });
  }
  models.UserFields.update({ name: user_field_name, value: user_field_value }, {where: {id: user_field_id, user_id: request.session.you.id}})
  .then(res => models.UserFields.findOne({where: {id: user_field_id, user_id: request.session.you.id}}))
  .then(uf => {
    let data = uf.dataValues;
    let obj = Object.assign({}, data, {dom: templateEngine.UserField_DOM(data)});
    return response.json({ user_field: obj, message: 'User Field Updated!' });
  })
  .catch(error => {
    console.log('error', error);
    return response.json({ error: true, message: 'Could not update user field...' });
  });
}



/* --- Exports --- */

module.exports = {
  sign_out,
  sign_in,
  update_icon,
  change_user_password,
  edit_user_field,
  edit_user_asset,
  edit_user_entity,
  edit_asset_field,
  edit_entity_field
}

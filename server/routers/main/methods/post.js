'use strict';

const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../../../models').models;
const chamber = require('../../../chamber');
const templateEngine = require('../../../templateEngine');
const google = require('../../../firebase_config/index');



/* --- POST Functions --- */

function sign_up(request, response) {
  (async function() {
    if(request.session.id) { return response.json({ error: true, message: "Client already signed in" }) }

    var { fname, mname, lname, password, password_verify } = request.body;
    if(email) { email = email.toLowerCase(); }

    if(!fname) {
      return response.json({ error: true, message: 'First Name field is required' });
    }
    if(!mname) {
      return response.json({ error: true, message: 'Middle Name field is required' });
    }
    if(!lname) {
      return response.json({ error: true, message: 'Last Name field is required' });
    }
    if(!email) {
      return response.json({ error: true, message: 'Email Address field is required' });
    }
    if(!password) {
      return response.json({ error: true, message: 'Password field is required' });
    }
    if(!password_verify) {
      return response.json({ error: true, message: 'Password Confirmation field is required' });
    }

    if(!chamber.validateName(fname)) {
      return response.json({ error: true, message: 'First name must be letters only, 2-50 characters long' });
    }
    if(!chamber.validateName(mname)) {
      return response.json({ error: true, message: 'Middle name must be letters only, 2-50 characters long' });
    }
    if(!chamber.validateName(lname)) {
      return response.json({ error: true, message: 'Last name must be letters only, 2-50 characters long' });
    }

    if(!chamber.validateEmail(email)) {
      return response.json({ error: true, message: 'Email is invalid' });
    }
    if(password !== password_verify) {
      return response.json({ error: true, message: 'Passwords must match' });
    }

    var check_email = await models.Users.findOne({ where: { email } });
    if(check_email) {
      return response.json({ error: true, message: 'Email already in use' });
    }

    /* Data Is Valid */

    password = bcrypt.hashSync(password);
    let new_user = await models.Users.create({ fname, mname, lname, email, password });
    let user = new_user.dataValues;
    delete user['password'];
    request.session.id = chamber.uniqueValue();
    request.session.you = user;

    return response.json({ session_id: request.session.id, online: true, user, message: 'Signed Up!' });
  })()
}

function sign_in(request, response) {
  (async function() {
    if(request.session.id) { return response.json({ error: true, message: "Client already signed in" }) }

    let { email, password } = request.body;
    if(email) { email = email.toLowerCase(); }

    if(!email) {
      return response.json({ error: true, message: 'Email Address field is required' });
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

/* --- */

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

  console.log('uploading...................');

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

function add_user_field(request, response) {
  let { user_field_name, user_field_value } = request.body;
  if(!chamber.validateField(user_field_name)) {
    return response.json({ error: true, message: 'New Name field is required; must be only letters and numbers, 2-50 characters' });
  }
  if(!user_field_value) {
    return response.json({ error: true, message: 'New Value field is required; cannot be empty' });
  }
  models.UserFields.create({ user_id: request.session.you.id, name: user_field_name, value: user_field_value })
  .then(new_user_field => {
    let data = new_user_field.dataValues;
    let obj = Object.assign({}, data, {dom: templateEngine.UserField_DOM(data)});
    return response.json({ new_user_field: obj, message: 'User Field Created!' });
  })
  .catch(error => {
    console.log('error', error);
    return response.json({ error: true, message: 'Could not create new user field...' });
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
  .then(res => {
    models.UserFields.findOne({where: {id: user_field_id, user_id: request.session.you.id}})
    .then(uf => {
      let data = uf.dataValues;
      let obj = Object.assign({}, data, {dom: templateEngine.UserField_DOM(data)});
      return response.json({ res, user_field: obj, message: 'User Field Updated!' });
    })
  })
  .catch(error => {
    console.log('error', error);
    return response.json({ error: true, message: 'Could not update user field...' });
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



function add_asset(request, response) {
  let { asset_name } = request.body;
  if(!chamber.validateField(asset_name)) {
    return response.json({ error: true, message: '"asset_name" is required; must be only letters and numbers, 2-50 characters' });
  }
  models.Assets.create({ user_id: request.session.you.id, name: asset_name })
  .then(new_asset => {
    return response.json({ new_asset: new_asset.dataValues, message: 'User Asset Created!' });
  })
  .catch(error => {
    console.log('error', error);
    return response.json({ error: true, message: 'Could not create new user asset...' });
  });
}

function add_asset_field(request, response) {
  let { field_name, field_value, asset_id } = request.body;
  if(!chamber.validateField(field_name)) {
    return response.json({ error: true, message: '"field_name" is required; must be only letters and numbers, 2-50 characters' });
  }
  if(!field_value) {
    return response.json({ error: true, message: '"field_value" is required' });
  }
  if(!chamber.validateInteger(asset_id)) {
    return response.json({ error: true, message: '"asset_id" is required; must be integer/number' });
  }
  models.AssetFields.create({ asset_id, name: field_name, value: field_value })
  .then(new_asset_field => {
    return response.json({ new_asset_field: new_asset_field.dataValues, message: 'Asset Field Created!' });
  })
  .catch(error => {
    console.log('error', error);
    return response.json({ error: true, message: 'Could not create new asset field...' });
  });
}

function edit_asset_field(request, response) {
  let { field_name, field_value, asset_field_id } = request.body;
  if(!chamber.validateField(field_name)) {
    return response.json({ error: true, message: '"field_name" is required; must be only letters and numbers, 2-50 characters' });
  }
  if(!field_value) {
    return response.json({ error: true, message: '"field_value" is required' });
  }
  if(!chamber.validateInteger(asset_field_id)) {
    return response.json({ error: true, message: '"asset_field_id" is required; must be integer/number' });
  }
  models.AssetFields.update({ name: field_name, value: field_value }, {where: {id: asset_field_id}})
  .then(res => {
    models.AssetFields.findOne({where: {id: asset_field_id, user_id: request.session.you.id}})
    .then(af => {
      return response.json({ res, asset_field: af.dataValues, message: 'Asset Field Updated!' });
    })
  })
  .catch(error => {
    console.log('error', error);
    return response.json({ error: true, message: 'Could not update asset field...' });
  });
}

function delete_asset_field(request, response) {
  let { asset_field_id } = request.body;
  if(!chamber.validateInteger(asset_field_id)) {
    return response.json({ error: true, message: '"asset_field_id" is required; must be integer/number' });
  }
  models.AssetFields.destroy({where: {id: asset_field_id}})
  .then(res => {
    return response.json({ res, message: 'Asset Field Deleted!' });
  })
  .catch(error => {
    console.log('error', error);
    return response.json({ error: true, message: 'Could not delete asset field...' });
  });
}





/* --- Exports --- */

module.exports = {
  sign_up,
  sign_in,
  sign_out,
  update_icon,
  add_user_field,
  edit_user_field,
  delete_user_field,
  add_asset,
  add_asset_field,
  edit_asset_field,
  delete_asset_field,
}

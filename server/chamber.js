'use strict';

const build_path = __dirname + '/_build/';
const html_path = build_path + 'html/';
const css_path = build_path + 'css/';
const js_path = build_path + 'js/';
const images_path = build_path + 'images/';

var paths = {
  build: __dirname + '/_build/',
  html: __dirname + '/_build/html/',
  templates: __dirname + '/_build/html/templates/',
  css: __dirname + '/_build/css/',
  js: __dirname + '/_build/js/',
  bin: __dirname + '/_build/bin/',
  images: __dirname + '/_build/images/',
  cdn: __dirname + '/_build/_cdn/',
  glyphs: __dirname + '/_build/glyphicons/'
}

var pages = {
  welcome: 'welcome.html',
  signup: 'signup.html',
  signin: 'signin.html',
  about: 'about.html',
  faq: 'faq.html',
  contact: 'contact.html',
  info: 'info-1.html',
  account: 'account.html',
  account_info: 'account-info.html',
  account_assets: 'account-assets.html',
  asset_fields: 'asset-fields.html',
  generic: 'generic.html',
  error: 'error.html',
}

const app_secret = `
7ajnwz%c42s1en1e3m#cjgxebxp6wsq3d7@qqoht54paiivlfw!w4mow8qg&ofxsp
vt97y08bru-inwre9vyn0wu-miw0bgwre_Ym4u387gtg=gt7cbuew_vtduefhbjjv
`;

// --- Helper Functions

function validateEmail(email) {
  if(!email) { return false; }
  if(email.constructor !== String) { return false; }
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email.toLowerCase());
}

function validateName(name) {
  if(!name) { return false; }
  if(name.constructor !== String) { return false; }
	var re = /^[a-zA-Z]{2,50}$/;
	return re.test(name.toLowerCase());
}

function validateAssetName(name) {
  if(!name) { return false; }
  if(name.constructor !== String) { return false; }
	var re = /^[a-zA-Z0-9\s\-\_\']{2,50}$/;
	return re.test(name.toLowerCase());
}

function validateEntityName(name) {
  if(!name) { return false; }
  if(name.constructor !== String) { return false; }
	var re = /^[a-zA-Z0-9\s\-\_\']{2,50}$/;
	return re.test(name.toLowerCase());
}

function validateField(field) {
  if(!field) { return false; }
  if(field.constructor !== String) { return false; }
	var re = /^[a-zA-Z0-9\s]{2,50}$/;
	return re.test(field.toLowerCase());
}

function validateInteger(number) {
  if(!number) { return false; }
  if(number.constructor !== Number) { return false; }
	var re = /^[0-9]+$/;
	return re.test(number);
}

function validatePassword(password) {
  if(!password) { return false; }
  if(password.constructor !== String) { return false; }

  let hasMoreThanSixCharacters = password.length > 6;
  let hasUpperCase = /[A-Z]/.test(password);
  let hasLowerCase = /[a-z]/.test(password);
  let hasNumbers = /\d/.test(password);
  let hasNonalphas = /\W/.test(password);

  return (
    hasMoreThanSixCharacters &&
    (hasUpperCase || hasLowerCase) &&
    hasNumbers
  );
}



function randomValue() {
  return String(Date.now()) +
    Math.random().toString(36).substr(2, 34)
}

function randomValueLong() {
  return String(Date.now()) +
    Math.random().toString(36).substr(2, 34) +
    Math.random().toString(36).substr(2, 34)
}

function uniqueValue() {
	return String(Date.now()) +
		Math.random().toString(36).substr(2, 34) +
    Math.random().toString(36).substr(2, 34) +
		Math.random().toString(36).substr(2, 34) +
		Math.random().toString(36).substr(2, 34)
}

function greatUniqueValue() {
	return String(Date.now()) +
		Math.random().toString(36).substr(2, 34) +
    Math.random().toString(36).substr(2, 34) +
    Math.random().toString(36).substr(2, 34) +
    Math.random().toString(36).substr(2, 34) +
		Math.random().toString(36).substr(2, 34) +
		Math.random().toString(36).substr(2, 34)
}

function capitalize(string) {
  let str = string.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function Authorize(request, response, next) {
  let method = request.method;

  if(method === "GET" || method === "HEAD") {
    return next();
  }
  if(method === "POST" || method === "PUT" || method === "DELETE") {
    if(Object.keys(request.body).length === 0) {
      return response.json({
        error: true,
        message: "request body was empty... check content-type & header(s)"
      })
    }

    if(!request.session.id) {
      return response.json({
        error: true,
        message: "request unauthenticated."
      })
    }

    return next();
  }
  else {
    return response.json({
      error: true,
      message: "request method unknown/rejected: " + String(method)
    })
  }
}

function GET_SessionRequired(request, response, next) {
  if(!request.session.id) {
    return response.render(pages['error'], { message: 'You are not Signed in.', signed_in: request.session.id || false });
  }
  else { next(); }
}

function GET_EntitySessionRequired(request, response, next) {
  if(!request.session.entity_session_id) {
    return response.render(pages['error'], { message: 'You are not Signed in.', signed_in: request.session.entity_session_id || false });
  }
  else { next(); }
}



function SessionRequired(request, response, next) {
  if(!request.session.id) {
    return response.json({ error: true, message: 'you are not signed in...' });
  }
  else { next(); }
}

function EntitySessionRequired(request, response, next) {
  if(!request.session.entity_session_id) {
    return response.json({ error: true, message: 'you are not signed in...' });
  }
  else { next(); }
}

/* --- */


function scanEntityForm(obj) {

}


/* --- */

module.exports = {
  paths,
  pages,
  //
	app_secret,
  //
  capitalize,
  validateEmail,
  validateName,
  validateAssetName,
  validateField,
  validateInteger,
  validatePassword,
  randomValue,
  randomValueLong,
  uniqueValue,
  greatUniqueValue,
  Authorize,
  GET_SessionRequired,
  GET_EntitySessionRequired,
  SessionRequired,
  EntitySessionRequired
}

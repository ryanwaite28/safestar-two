'use strict';

const express = require('express');
const cors = require('cors');

const GET = require('./methods/get');
const POST = require('./methods/post');
const PUT = require('./methods/put');
const DELETE = require('./methods/delete');

const chamber = require('../../chamber');
const templateEngine = require('../../templateEngine');



const router = express.Router();
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
// router.use(cors());


/* --- GET Routes --- */



router.get('/', function(request, response) {
  GET.welcome_page(request, response);
});

router.get('/signup', function(request, response) {
  GET.signup_page(request, response);
});

router.get('/signin', function(request, response) {
  GET.signin_page(request, response);
});

router.get('/signout', function(request, response){
  GET.sign_out(request, response);
});

router.get('/account', chamber.GET_SessionRequired, function(request, response) {
  GET.account_page(request, response);
});

router.get('/account/info', chamber.GET_SessionRequired, function(request, response) {
  GET.account_info_page(request, response);
});

router.get('/account/assets', chamber.GET_SessionRequired, function(request, response) {
  GET.account_assets_page(request, response);
});

router.get('/account/assets/:asset_unique_value', chamber.GET_SessionRequired, function(request, response) {
  GET.asset_fields_page(request, response);
});



router.get('/test_route', function(request, response){
  GET.test_route(request, response);
});

router.get('/check_session', function(request, response){
  GET.check_session(request, response);
});

router.get('/get_user_fields_count', chamber.SessionRequired, function(request, response){
  GET.get_user_fields_count(request, response);
});
router.get('/get_user_fields', chamber.SessionRequired, function(request, response){
  GET.get_user_fields(request, response);
});
router.get('/get_user_fields/:user_field_id', chamber.SessionRequired, function(request, response){
  GET.get_user_fields(request, response);
});
router.get('/get_user_field/:user_field_unique_value', chamber.SessionRequired, function(request, response){
  GET.get_user_field(request, response);
});

router.get('/get_user_assets_count', chamber.SessionRequired, function(request, response){
  GET.get_user_assets_count(request, response);
});
router.get('/get_user_assets', chamber.SessionRequired, function(request, response){
  GET.get_user_assets(request, response);
});
router.get('/get_user_assets/:user_asset_id', chamber.SessionRequired, function(request, response){
  GET.get_user_assets(request, response);
});
router.get('/get_user_asset/:asset_unique_value', chamber.SessionRequired, function(request, response){
  GET.get_user_asset(request, response);
});

router.get('/get_asset_fields_count/:asset_id', chamber.SessionRequired, function(request, response){
  GET.get_asset_fields_count(request, response);
});
router.get('/get_asset_fields/:asset_id', chamber.SessionRequired, function(request, response){
  GET.get_asset_fields(request, response);
});
router.get('/get_asset_fields/:asset_id/:asset_field_id', chamber.SessionRequired, function(request, response){
  GET.get_asset_fields(request, response);
});
router.get('/get_asset_field/:asset_field_unique_value', chamber.SessionRequired, function(request, response){
  GET.get_asset_field(request, response);
});



/* --- POST Routes --- */



router.post('/sign_up', function(request, response){
  POST.sign_up(request, response);
});

router.post('/add_user_field', chamber.SessionRequired, function(request, response){
  POST.add_user_field(request, response);
});

router.post('/add_user_asset', chamber.SessionRequired, function(request, response){
  POST.add_user_asset(request, response);
});

router.post('/add_user_entity', chamber.SessionRequired, function(request, response){
  POST.add_user_entity(request, response);
});

router.post('/add_asset_field', chamber.SessionRequired, function(request, response){
  POST.add_asset_field(request, response);
});

router.post('/add_entity_field', chamber.SessionRequired, function(request, response){
  POST.add_entity_field(request, response);
});



/* --- PUT Routes --- */



router.put('/sign_in', function(request, response){
  PUT.sign_in(request, response);
});

router.put('/sign_out', function(request, response){
  PUT.sign_out(request, response);
});

router.put('/update_icon', chamber.SessionRequired, function(request, response){
  PUT.update_icon(request, response);
});

router.put('/change_user_password', chamber.SessionRequired, function(request, response){
  PUT.change_user_password(request, response);
});


router.put('/edit_entity_field', chamber.SessionRequired, function(request, response){
  PUT.edit_entity_field(request, response);
});

router.put('/edit_asset_field', chamber.SessionRequired, function(request, response){
  PUT.edit_asset_field(request, response);
});

router.put('/edit_user_entity', chamber.SessionRequired, function(request, response){
  PUT.edit_user_entity(request, response);
});

router.put('/edit_user_asset', chamber.SessionRequired, function(request, response){
  PUT.edit_user_asset(request, response);
});

router.put('/edit_user_field', chamber.SessionRequired, function(request, response){
  PUT.edit_user_field(request, response);
});



/* --- DELETE Routes --- */




router.delete('/delete_entity_field', chamber.SessionRequired, function(request, response){
  DELETE.delete_entity_field(request, response);
});

router.delete('/delete_asset_field', chamber.SessionRequired, function(request, response){
  DELETE.delete_asset_field(request, response);
});

router.delete('/delete_user_field', chamber.SessionRequired, function(request, response){
  DELETE.delete_user_field(request, response);
});

router.delete('/delete_user_asset', chamber.SessionRequired, function(request, response){
  DELETE.delete_user_asset(request, response);
});

router.delete('/delete_user_entity', chamber.SessionRequired, function(request, response){
  DELETE.delete_user_entity(request, response);
});





/* --- exports --- */

module.exports = {
  router
}

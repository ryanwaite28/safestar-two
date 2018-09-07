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

router.get('/get_user_fields', chamber.SessionRequired, function(request, response){
  GET.get_user_fields(request, response);
});

router.get('/get_user_asset/:asset_unique_value', chamber.SessionRequired, function(request, response){
  GET.get_user_asset(request, response);
});

router.get('/get_user_assets', chamber.SessionRequired, function(request, response){
  GET.get_user_assets(request, response);
});

router.get('/get_asset_fields/:asset_id', chamber.SessionRequired, function(request, response){
  GET.get_asset_fields(request, response);
});



/* --- POST Routes --- */


router.post('/sign_up', function(request, response){
  POST.sign_up(request, response);
});

router.post('/sign_in', function(request, response){
  POST.sign_in(request, response);
});

router.post('/sign_out', function(request, response){
  POST.sign_out(request, response);
});



router.post('/update_icon', chamber.SessionRequired, function(request, response){
  POST.update_icon(request, response);
});


router.post('/add_user_field', chamber.SessionRequired, function(request, response){
  POST.add_user_field(request, response);
});

router.post('/edit_user_field', chamber.SessionRequired, function(request, response){
  POST.edit_user_field(request, response);
});

router.post('/delete_user_field', chamber.SessionRequired, function(request, response){
  POST.delete_user_field(request, response);
});


router.post('/add_user_asset', chamber.SessionRequired, function(request, response){
  POST.add_user_asset(request, response);
});

router.post('/edit_user_asset', chamber.SessionRequired, function(request, response){
  POST.edit_user_asset(request, response);
});

router.post('/delete_user_asset', chamber.SessionRequired, function(request, response){
  POST.delete_user_asset(request, response);
});


router.post('/add_user_entity', chamber.SessionRequired, function(request, response){
  POST.add_user_entity(request, response);
});

router.post('/edit_user_entity', chamber.SessionRequired, function(request, response){
  POST.edit_user_entity(request, response);
});

router.post('/delete_user_entity', chamber.SessionRequired, function(request, response){
  POST.delete_user_entity(request, response);
});


router.post('/add_asset_field', chamber.SessionRequired, function(request, response){
  POST.add_asset_field(request, response);
});

router.post('/edit_asset_field', chamber.SessionRequired, function(request, response){
  POST.edit_asset_field(request, response);
});

router.post('/delete_asset_field', chamber.SessionRequired, function(request, response){
  POST.delete_asset_field(request, response);
});


router.post('/add_entity_field', chamber.SessionRequired, function(request, response){
  POST.add_entity_field(request, response);
});

router.post('/edit_entity_field', chamber.SessionRequired, function(request, response){
  POST.edit_entity_field(request, response);
});

router.post('/delete_entity_field', chamber.SessionRequired, function(request, response){
  POST.delete_entity_field(request, response);
});


/* --- PUT Routes --- */







/* --- DELETE Routes --- */








/* --- exports --- */

module.exports = {
  router
}

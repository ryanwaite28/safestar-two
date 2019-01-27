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

router.get('/', GET.welcome_page);

router.get('/signup', GET.signup_page);
router.get('/signin', GET.signin_page);
router.get('/signout', GET.sign_out);
router.get('/account', chamber.GET_SessionRequired, GET.account_page);
router.get('/account/info', chamber.GET_SessionRequired, GET.account_info_page);
router.get('/account/assets', chamber.GET_SessionRequired, GET.account_assets_page);
router.get('/account/assets/:asset_unique_value', chamber.GET_SessionRequired, GET.asset_fields_page);

router.get('/test_route', GET.test_route);
router.get('/check_session', GET.check_session);

router.get('/get_user_fields_count', chamber.SessionRequired, GET.get_user_fields_count);
router.get('/get_user_fields', chamber.SessionRequired, GET.get_user_fields);
router.get('/get_user_fields/:user_field_id', chamber.SessionRequired, GET.get_user_fields);
router.get('/get_user_field/:user_field_unique_value', chamber.SessionRequired, GET.get_user_field);

router.get('/get_user_assets_count', chamber.SessionRequired, GET.get_user_assets_count);
router.get('/get_user_assets', chamber.SessionRequired, GET.get_user_assets);
router.get('/get_user_assets/:user_asset_id', chamber.SessionRequired, GET.get_user_assets);
router.get('/get_user_asset/:asset_unique_value', chamber.SessionRequired, GET.get_user_asset);

router.get('/get_asset_fields_count/:asset_id', chamber.SessionRequired, GET.get_asset_fields_count);
router.get('/get_asset_fields/:asset_id', chamber.SessionRequired, GET.get_asset_fields);
router.get('/get_asset_fields/:asset_id/:asset_field_id', chamber.SessionRequired, GET.get_asset_fields);
router.get('/get_asset_field/:asset_field_unique_value', chamber.SessionRequired, GET.get_asset_field);



/* --- POST Routes --- */

router.post('/sign_up', POST.sign_up);

router.post('/add_user_field', chamber.SessionRequired, POST.add_user_field);
router.post('/add_user_asset', chamber.SessionRequired, POST.add_user_asset);
router.post('/add_user_entity', chamber.SessionRequired, POST.add_user_entity);
router.post('/add_asset_field', chamber.SessionRequired, POST.add_asset_field);
router.post('/add_entity_field', chamber.SessionRequired, POST.add_entity_field);



/* --- PUT Routes --- */

router.put('/sign_in', PUT.sign_in);
router.put('/sign_out', PUT.sign_out);

router.put('/update_icon', chamber.SessionRequired, PUT.update_icon);
router.put('/change_user_password', chamber.SessionRequired, PUT.change_user_password);

router.put('/edit_entity_field', chamber.SessionRequired, PUT.edit_entity_field);
router.put('/edit_asset_field', chamber.SessionRequired, PUT.edit_asset_field);
router.put('/edit_user_entity', chamber.SessionRequired, PUT.edit_user_entity);
router.put('/edit_user_asset', chamber.SessionRequired, PUT.edit_user_asset);
router.put('/edit_user_field', chamber.SessionRequired, PUT.edit_user_field);



/* --- DELETE Routes --- */

router.delete('/delete_entity_field', chamber.SessionRequired, DELETE.delete_entity_field);
router.delete('/delete_asset_field', chamber.SessionRequired, DELETE.delete_asset_field);
router.delete('/delete_user_field', chamber.SessionRequired, DELETE.delete_user_field);
router.delete('/delete_user_asset', chamber.SessionRequired, DELETE.delete_user_asset);
router.delete('/delete_user_entity', chamber.SessionRequired, DELETE.delete_user_entity);



/* --- exports --- */

module.exports = {
  router
}

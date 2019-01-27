'use strict';

const express = require('express');
const cors = require('cors');

const GET = require('./methods/get');
const POST = require('./methods/post');
const PUT = require('./methods/put');
const DELETE = require('./methods/delete');

const chamber = require('../../chamber');



const router = express.Router();
router.use(cors());



/* --- GET Routes --- */



router.get('/', GET.welcome_api);



/* --- POST Routes --- */





/* --- PUT Routes --- */







/* --- DELETE Routes --- */








/* --- exports --- */

module.exports = {
  router
}

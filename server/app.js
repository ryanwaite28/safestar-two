'use strict';

/* --- Requirements --- */

const express = require('express');
const cors = require('cors');
const client_sessions = require('client-sessions');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const validator = require('validator');
const email = require("emailjs");

const chamber = require('./chamber');
const templateEngine = require('./templateEngine');
const main_router = require('./routers/main/router').router;
const api_router = require('./routers/api/router').router;


/* --- setup --- */


const app = express();

app.use(fileUpload({ safeFileNames: true, preserveExtension: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static( chamber.paths['build'] ));
app.use('/css', express.static( chamber.paths['css'] ));
app.use('/js', express.static( chamber.paths['js'] ));
app.use('/bin', express.static( chamber.paths['bin'] ));
app.use('/images', express.static( chamber.paths['images'] ));
app.use('/_cdn', express.static( chamber.paths['cdn'] ));

templateEngine.installExpressApp(app);

app.use(client_sessions({
  cookieName: 'session',
  secret: chamber.app_secret,
  duration: 5 * 30 * 60 * 1000,
  activeDuration: 2 * 5 * 60 * 1000,
  cookie: {
	  httpOnly: false,
	  secure: false,
	  ephemeral: false
  }
}));

/* --- Socket IO --- */

const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', function(client){

});

app.use(function(request, response, next){
  request.io = io;
  next();
});

/* --- Routes --- */



app.use("/", main_router);
app.use("/api", api_router);



/* --- Listen --- */

const PORT = process.env.PORT || 8000;
server.listen(PORT);
console.log('Listening on port ' + PORT + '...');

// app.set('port', (process.env.PORT || 3000));
// app.listen(app.get('port'), function() {
//   console.log('Listening on port ' + String(app.get('port')) + '...');
// });

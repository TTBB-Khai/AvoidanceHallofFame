const env = require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
try {
	mongoose.connect(process.env.DBURL, { 
		useNewUrlParser: true,
		autoIndex: false,
		useUnifiedTopology: true 
	});
} catch (err) {
	console.log(err.stack);
}

// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See
// http://expressjs.com/api#app-settings for more details.
app.enable('trust proxy');
// Add a handler to inspect the req.secure flag (see
// http://expressjs.com/api#req.secure). This allows us
// to know whether the request was via http or https.
app.use(function (req, res, next) {
 if (req.secure) {
 // request was via https, so do no special handling
 next();
 } else {
 // request was via http, so redirect to https
 res.redirect('https://' + req.headers.host + req.url);
 }
});

// cors
app.use((req, res, next) => {
	res.header('access-control-allow-origin', 'http://localhost:3000');
	res.header(
		'access-control-allow-headers',
		'origin, x-requested-with, content-type, accept'
	);
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
	next();
});

// parse application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'))

app.use((err, req, res, next) => {
	// Do logging and user-friendly error message display
	console.error(err);
	res.status(500).send('internal server error');
});

app.use(require('./routes'));

app.listen(port, () => {
	console.log(`listening on port ${port} - ${process.env.NODE_ENV}`);
});
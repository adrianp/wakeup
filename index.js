'use strict';

var compression = require('compression');
var express = require('express');
var moment = require('moment');
var path = require('path');

var quotes = require('./quotes.json');


var time = function time(v) {
	var result = moment();
	if (v) {
		result = moment(v, 'DD.MM.YYYY');
	}
	if (process.env.PORT) {
		// running on Heroku, we need to offset the time
		return result.utcOffset(+180);
	}
	return result;
};

var cheat = function cheat() {
	var hour = time().hour();
	if (hour < 6) {
		return 0;
	}
	if (hour >= 9) {
		return 2;
	}
	return 1;
};

var quote = function quote() {
	var result = 'Sorry, I forgot to add the quote for today; you win!';
	for (var k in quotes) {
		if (quotes.hasOwnProperty(k)) {
			if (time().startOf('day').isSame(time(k).startOf('day'))) {
				result = quotes[k];
				break;
			}
		}
	}
	return result;
};

var app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, '/static')));

app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.get('/', function indexReq(request, response) {
	response.render('index', {
		'timestamp': new Date().getTime(),
		'cheat': cheat(),
		'quote': quote()
	});
});

app.get('*', function indexReq(request, response) {
	response.redirect('/');
});

app.listen(app.get('port'), function start() {
	console.log('Node app is running on port', app.get('port'));
});


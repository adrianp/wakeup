'use strict';

var express = require('express');
var path = require('path');

var quote = function quote() {
	return 'Lorem ipsum dolor';
};

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, '/static')));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.get('/', function indexReq(request, response) {
  response.render('index', {'quote': quote()});
});

app.listen(app.get('port'), function start() {
  console.log('Node app is running on port', app.get('port'));
});

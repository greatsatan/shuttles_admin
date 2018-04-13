var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
var expressErrorHandler = require('express-error-handler');
var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});
var expressSession = require('express-session');
var admin_menu = require('./routes/menu');
var admin_event = require('./routes/event');
var admin_login = require('./routes/login');
var admin_summary = require('./routes/summary');

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'management')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(expressSession({
    secret : 'my key',
    resave : true,
    saveSUninitialized : true
}));

app.use('/', admin_login);
app.use('/menu', admin_menu);
app.use('/event', admin_event);
app.use('/summary', admin_summary);

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(3325, function() {
    console.log('Express 서버가 3325번 포트에서 시작');
});

module.exports = app;
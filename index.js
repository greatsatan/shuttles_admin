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
var admin_notice = require('./routes/notice');
var admin_login = require('./routes/login');
var admin_summary = require('./routes/summary');
var admin_todayDrink = require('./routes/todayDrink');
var admin_user = require('./routes/user');
var admin_market = require('./routes/market');
var admin_signup = require('./routes/singup');
var admin_webUser = require('./routes/webUser');

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
app.use('/notice', admin_notice);
app.use('/summary', admin_summary);
app.use('/todaydrink', admin_todayDrink);
app.use('/user', admin_user);
app.use('/market', admin_market);
app.use('/signup', admin_signup);
app.use('/webUser', admin_webUser);

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(8765, function() {
    console.log('Express 서버가 8765번 포트에서 시작');
});

module.exports = app;

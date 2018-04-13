var express = require('express');
var router = express.Router();
var connection = require('../db/db_con');

router.get('/', function(req, res){ 
    if(req.session.user) {
        connection.query("select * from orders", function(err, result) {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            var context = {result: result};
            req.app.render('summary', context, function(err, html) {
                if(err) {throw err};
                res.end(html);
            });

        });
    }
    else {
        res.redirect('/login.html');
    }
});

module.exports = router;
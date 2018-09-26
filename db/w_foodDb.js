var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '#@tiqrhf#@',
    database: 'shuttlesDB'
});

var food_list = function(req, res) {
    pool.getConnection(function(err, connection) {
        var market_id = req.session.user.m_id;

        if(market_id == 0) {
            var market_id = req.param('mId');
        }
        
        connection.query("select * from food where market_id=?", market_id, function(err, results) {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            var context = {
                results: results
            };

            req.app.render('foodList', context, function(err, html) {
                if(err) {throw err};
                res.end(html);
            });

        });

    });
}

exports.foodList = function(req, res) {
    food_list(req, res);
}
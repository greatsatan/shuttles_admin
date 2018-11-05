var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '#@tiqrhf#@',
    database: 'shuttlesDB'
});

var market_list = function(req, res) {
    pool.getConnection(function(err, connection) {

        connection.query("select * from market", function(err, results) {
            connection.release();
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            var context = {
                results: results
            };

            req.app.render('marketList', context, function(err, html) {
                if(err) {throw err};
                res.end(html);
            });

        });

    });
}

exports.marketList = function(req, res) {
    market_list(req, res);
}
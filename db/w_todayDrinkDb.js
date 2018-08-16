var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '#@tiqrhf#@',
    database: 'shuttlesDB'
});

exports.todayDrinkList = function(req, res) {
    pool.getConnection(function(err, connection) {

        connection.query("select * from todayDrinkMenu", function(err, results) {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            var context = {
                results: results
            };
            req.app.render('todayDrinkList', context, function(err, html) {
                if(err) {throw err};
                res.end(html);
            });

        });

    });
}

exports.todayDrinkUpdate = function(req, res) {
    pool.getConnection(function(err, connection) {
        
    });
}

exports.todayDrinkDelete = function(req, res) {
    pool.getConnection(function(err, connection) {

    });
}

exports.todayDrinkUpdatePage = function(req, res) {
    pool.getConnection(function(err, connection) {
        
    });
}
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '#@tiqrhf#@',
    database: 'shuttlesDB'
});

exports.summary = function(req, res) {
    pool.getConnection(function(err, connection) {
        var select_user = req.param("select_user");
        var user;
        connection.query("select * from user", function(err, results) {
            user = results;
        });

        if(select_user == 'all') {
            connection.query("select * from orders", function(err, results) {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                var context = {
                    results: results,
                    user: user
                };
                req.app.render('summary', context, function(err, html) {
                    if(err) {throw err};
                    res.end(html);
                });
    
            });
        }
        else {
            connection.query('select * from orders where user_id=?', [select_user], function(err, results) {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                var context = {
                    results: results,
                    user: user
                };
                req.app.render('summary', context, function(err, html) {
                    if(err) {throw err};
                    res.end(html);
                });   
            });
        }

        
    });
}
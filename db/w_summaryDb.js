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
        connection.query("select * from orders", function(err, result) {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            var context = {result: result};
            req.app.render('summary', context, function(err, html) {
                if(err) {throw err};
                res.end(html);
            });

        });
    });
}
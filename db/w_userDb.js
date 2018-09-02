var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '#@tiqrhf#@',
    database: 'shuttlesDB'
});

var user_list = function(req, res) {
    pool.getConnection(function(err, connection) {

        connection.query("select * from user", function(err, results) {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            var context = {
                results: results
            };

            req.app.render('userList', context, function(err, html) {
                if(err) {throw err};
                res.end(html);
            });

        });

    });
}

exports.userList = function(req, res) {
    user_list(req, res);
}

exports.userUpdate = function(req, res) {
    var id = req.param('user_id');
    var auth = parseInt(req.param('auth'));

    console.log(id + " / " + auth);

    pool.getConnection(function(err, connection) {        
        connection.query("update user set type=? where user_id=?", [auth, id], function(err, result) {
            user_list(req, res);  
        });
    });
}

exports.userDelete = function(req, res) {
    var id = req.param("user_id");
    console.log(id + " / ");
    pool.getConnection(function(err, connection) {
        connection.query("delete from user where user_id=?", [id], function(err, results) {
            user_list(req, res);
        });
    });
}
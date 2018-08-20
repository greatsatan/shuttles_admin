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

exports.userAdd = function(req, res) {

    pool.getConnection(function(err, connection) {
        connection.query('update user set today_menu=1 where coffee_id=?', id, function(err, result) {
            if(err) {
                console.log(err);
            }  
            else {          
                connection.query("update coffee_size set today_price=? where coffee_id=?", [price, id], function(err, result) {
                    todayDrink_list(req, res);  
                });
            }
        });
    });
}

exports.userUpdate = function(req, res) {
    var id = req.param('todayDrink_id');
    var price = parseInt(req.param('price'));

    console.log(id + " / " + price);

    pool.getConnection(function(err, connection) {        
        connection.query("update coffee_size set today_price=? where coffee_id=?", [price, id], function(err, result) {
            todayDrink_list(req, res);  
        });
    });
}

exports.userDelete = function(req, res) {
    var id = req.param("todayDrink_id");
    pool.getConnection(function(err, connection) {
        connection.query("call today_menu_del(?)", [id], function(err, results) {
            todayDrink_list(req, res);
        });
    });
}
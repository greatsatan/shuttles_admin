var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '#@tiqrhf#@',
    database: 'shuttlesDB'
});

var todayDrink_list = function(req, res) {
    pool.getConnection(function(err, connection) {

        connection.query("select * from coffee_list where today_menu=1", function(err, results) {
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

exports.todayDrinkList = function(req, res) {
    todayDrink_list(req, res);
}

exports.todayDrinkAdd = function(req, res) {
    var id = req.param('coffee_id');
    var price = parseInt(req.param('price'));

    pool.getConnection(function(err, connection) {
        connection.query('update coffee set today_menu=1 where coffee_id=?', id, function(err, result) {
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

exports.todayDrinkUpdate = function(req, res) {
    var id = req.param('todayDrink_id');
    var price = parseInt(req.param('price'));

    console.log(id + " / " + price);

    pool.getConnection(function(err, connection) {        
        connection.query("update coffee_size set today_price=? where coffee_id=?", [price, id], function(err, result) {
            todayDrink_list(req, res);  
        });
    });
}

exports.todayDrinkDelete = function(req, res) {
    var id = req.param("todayDrink_id");
    pool.getConnection(function(err, connection) {
        connection.query("call today_menu_del(?)", [id], function(err, results) {
            todayDrink_list(req, res);
        });
    });
}
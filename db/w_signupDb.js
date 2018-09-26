var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '#@tiqrhf#@',
    database: 'shuttlesDB'
});

exports.signup = function(req, res) {
    var paramId = req.param('user_id');
    var paramPassword = req.param('password');

    if(paramId && paramPassword) {
        pool.getConnection(function(err, connection) {
            connection.query("insert into web_user values(?, password(?), NULL, NULL)", [paramId, paramPassword], function(err, rows, fields) {
                if(!err) {
                    console.log(paramId + "회원이 가입하였습니다.");
                    res.redirect('/login.html');
                }
                else {
                    console.log(err);
                    res.redirect('/login.html');
                }
            });
        });
    }  
    else {
        console.log("ID, Password Error");
        res.redirect('/login.html');
    } 
}

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '#@tiqrhf#@',
    database: 'shuttlesDB'
});
var imagePath = "https://s3.ap-northeast-2.amazonaws.com/shuttles/coffee/";
var coffeeDb = require('../db/w_coffeeDb');

exports.login = function(req, res) {
    var paramId = req.param('id');
    var paramPassword = req.param('password');
    var userId = '';
    var userPw = '';

    var columns = ['user_id', 'password'];
    var tablename = 'web_user';
    
    pool.getConnection(function(err, connection) {
        connection.query("select ?? from ?? where user_id = ? AND password=password(?)", [columns, tablename, paramId, paramPassword], function(err, rows, fields) {
            if(!err && rows.length>0) {
                console.log("사용자 인증 완료");
                userId = rows[0].user_id;
                userPw = rows[0].password;

                console.log(userId + "님이 로그인 하였습니다.");
    
                if(req.session.user) {
                    // 이미 로그인 되어있는 상태
                }
                else {
                    req.session.user = {
                        id: userId,
                        authorized:true
                    }
                }

                res.redirect('/menu/list');
                //coffeeDb.coffeeList(req, res);
       
            }
            else {
                res.redirect('/login.html');
                console.log("사용자 인증 실패");
            }
        });
    });
}

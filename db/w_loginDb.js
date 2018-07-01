var mysql = require('mysql');
var string = require('string');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '#@tiqrhf#@',
    database: 'shuttlesDB'
});
var imagePath = "https://s3.ap-northeast-2.amazonaws.com/shuttles/coffee/";

exports.login = function(req, res) {
    var paramId = req.param('id');
    var paramPassword = req.param('password');
    var username = '??';

    var columns = ['user_id', 'username'];
    var tablename = 'user';
    
    pool.getConnection(function(err, connection) {
        connection.query("select ?? from ?? where user_id = ?", [columns, tablename, paramId], function(err, rows, fields) {
            if(!err && rows.length>0) {
                console.log("사용자 인증 완료");
                username = rows[0].username;
    
                if(req.session.user) {
                    // 이미 로그인 되어있는 상태
                }
                else {
                    req.session.user = {
                        id: paramId,
                        name: username,
                        authorized:true
                    }
                }
    
                connection.query("select * from coffee_list", function(err, results) {
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    
                    var context = {results: results};
                    var length = results.length;
                    var pathLen = imagePath.length;
                    for(var i=0; i<length; i++) {
                        var strLen = results[i].picture_url.length;
                        results[i].picture_url = results[i].picture_url.substring(pathLen, strLen);
                    }
                    
                    req.app.render('menuList', context, function(err, html) {
                        if(err) {throw err};
                         res.end(html);
                      });
    
                });
    
            }
            else {
                res.redirect('/login.html');
                console.log("사용자 인증 실패");
            }
        });
    });
}

var mysql = require('mysql');
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
    var userId = '';
    
    pool.getConnection(function(err, connection) {
        connection.query("select user_id from web_user where user_id = ? AND password=password(?)", [paramId, paramPassword], function(err, rows, fields) {
            if(!err && rows.length>0) {
                userId = rows[0].user_id;
                
                connection.query("select * from market where user_id=?", userId, function(err, marketInfo) {
                    var market_id = marketInfo[0].market_id;
                    console.log(userId + "님이 로그인 하였습니다.");
    
                    if(req.session.user) {
                        // 이미 로그인 되어있는 상태
                    }
                    else {
                        req.session.user = {
                            id: userId,
                            m_id: market_id,
                            authorized:true
                        }
                    } 
                    res.redirect('/menu/list');
                });
                
            }
            else {
                res.redirect('/login.html');
                console.log("사용자 인증 실패");
            }
        });
    });
}

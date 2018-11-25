var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '#@tiqrhf#@',
    database: 'shuttlesDB'
});
var imagePath = "https://s3.ap-northeast-2.amazonaws.com/shuttles/coffee/";
var fooddb = require('../db/w_foodDb');

exports.login = function(req, res) {
    var paramId = req.param('id');
    var paramPassword = req.param('password');
    var user_id = "";
    var market_id = -1;
    
    pool.getConnection(function(err, connection) {
        connection.query("select * from web_user where user_id = ? AND password=password(?)", [paramId, paramPassword], function(err, rows, fields) {
            if(!err && rows.length>0) {
                connection.release();
                user_id = rows[0].user_id;
                market_id = rows[0].market_id;

                console.log(user_id+ " / " + market_id);

                if(market_id != undefined) {
                    console.log(user_id + "님이 로그인 하였습니다.");
                    if(req.session.user) {
                        // 이미 로그인 되어있는 상태
                    }
                    else {
                        req.session.user = {
                            id: user_id,
                            m_id: market_id,
                            authorized:true
                        }
                    } 
                    if(market_id==0) {
                        res.redirect('/menu/list');
                    }
                    else {
                        fooddb.foodList(req, res);
                    }
                }
                else {
                    console.log(user_id + "님은 관리자 승인이 필요합니다.");
                }               
            }
            else {
                res.redirect('/login.html');
                console.log("사용자 인증 실패");
            }
        });
    });
}
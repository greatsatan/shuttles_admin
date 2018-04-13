var mysql = require('mysql');
var jimp = require('jimp');
var AWS = require('aws-sdk');
var fs = require('fs');
AWS.config.region = 'ap-northeast-2';
var s3 = new AWS.S3();
var param = {
    'Bucket':'shuttles/coffee',
    'Key':null,
    'ACL':'public-read',
    'Body': null, //fs.createReadStream('gf.png'),
    'ContentType':'images/png'
};

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'wjddn332!',
    database: 'Shuttels'
});

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
    
                connection.query("select * from menu_list", function(err, results) {
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    
                    var context = {results: results};
                    req.app.render('../views/menuList', context, function(err, html) {
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
var mysql = require('mysql');
var fs = require('fs');
var jimp = require('jimp');
var AWS = require('aws-sdk');
var fs = require('fs');
AWS.config.update({
    "region": "ap-northeast-2",
})
var s3 = new AWS.S3();
var param = {
    'Bucket':'shuttles/coffee',
    'Key':null,
    'ACL':'public-read',
    'Body': null, //fs.createReadStream('gf.png'),
    'ContentType':'images/png'
};
var imagePath = "https://s3.ap-northeast-2.amazonaws.com/shuttles/coffee/";
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '#@tiqrhf#@',
    database: 'shuttlesDB'
});

var notice_list = function(req, res) {
    pool.getConnection(function(err, connection) {
        connection.query("select * from notice", function(err, results) {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            
            var context = {results: results};
            req.app.render('noticeList', context, function(err, html) {
                if(err) {throw err};
                res.end(html);
            });

        });
    });
}

exports.noticeList = function(req, res) {
    notice_list(req, res);
}

exports.noticeUpload = function(req, res) {
	
    console.log(req);
    var subject = req.param("notice_subject");
    var content = req.param("notice_content");
    var file = req.file;
    var filename, picture_url;
    if(file) {
        filename = file.originalname;
        picture_url = imagePath + filename;
    }

    console.log(subject + "/"+ content + "/" + filename);

    pool.getConnection(function(err, connection) {
    
        if(subject && content) {

            connection.query("insert into notice values(NULL, ?, ?, ?, NULL)", [subject, content, picture_url], function(err) {
                var menuImg = './uploads/'+filename;
                jimp.read(menuImg, function(err, img) {
                    img.write(menuImg, function(err) {
                        param.Key = filename;
                        param.Body = fs.createReadStream(menuImg);
                            
                        s3.upload(param, function(err, data) {
                            if(err) {
                                console.log(err);
                            }
                            else {
                                console.log(data);
                                notice_list(req, res);
                            }
                        });
                    });
                }).catch(function(err) {
                    console.log(err);       
                });
                
            });
                      
        }
        else {
            console.log("내용을 전부 입력해주세요.");
        }
    });
}

exports.noticeUpdate = function(req, res) {
    pool.getConnection(function(err, connection) {
        var id = req.param('notice_id');

        var subject = req.param('notice_subject');
        var content = req.param('notice_content');
        var picture = req.param("notice_picture");

        if(subject && content) {
            
            console.log('제목: ' + subject + ', 내용: '+ content);

            connection.query('update notice set notice_subject=?, notice_content=?, notice_date=utc_timestamp() where notice_id=?', 
                [subject, content, id],
            function(err, result) {
                console.log(id+'번 id번호가 수정되었습니다.');
                
                notice_list(req, res); 
            });
        }
        else {
            console.log("내용을 전부 입력해주세요.");  
        }
    });
}

exports.noticeDelete = function(req, res) {
    pool.getConnection(function(err, connection) {
        var notice_id = req.param('notice_id');

        connection.query('delete from notice where notice_id=?', notice_id,
            function(err, result) {
            console.log(notice_id+'번 id번호가 삭제되었습니다.');
            
            notice_list(req, res);    
        });
    });
}

exports.noticeUpdatePage = function(req, res) {
    pool.getConnection(function(err, connection) {
        var notice_id = req.param('notice_id');
        console.log(notice_id);

        connection.query("select * from notice where notice_id = ?", notice_id, function(err, result) {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            var context = {result: result};
            req.app.render('noticeUpdate', context, function(err, html) {
                if(err) {throw err};
                res.end(html);
            });
        });
    });
}

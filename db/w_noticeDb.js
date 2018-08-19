var mysql = require('mysql');
var fs = require('fs');
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
    var picture = req.param("notice_picture");

    //var currentTime = date.getFullYear();

    console.log(subject + "/"+ content + "/" + picture);

    pool.getConnection(function(err, connection) {
    
        if(subject && content) {

            connection.query("insert into notice values(NULL, ?, ?, ?, NULL)", [subject, content, picture], function(err) {
                console.log('제목: ' + subject + ', 내용: '+ content);
                notice_list(req, res);
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

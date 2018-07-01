var mysql = require('mysql');
var fs = require('fs');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '#@tiqrhf#@',
    database: 'shuttlesDB'
});

var event_list = function(req, res) {
    pool.getConnection(function(err, connection) {
        connection.query("select * from event", function(err, results) {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            
            var context = {results: results};
            req.app.render('eventList', context, function(err, html) {
                if(err) {throw err};
                res.end(html);
            });

        });
    });
}

exports.eventList = function(req, res) {
    event_list(req, res);
}

exports.eventUpload = function(req, res) {
    var subject = req.param("event_subject");
    var content = req.param("event_content");
    console.log(subject + "/"+ content);
    pool.getConnection(function(err, connection) {
    
        if(subject && content) {
       
            connection.query("insert into event values(NULL, ?, ?, utc_timestamp(), utc_timestamp(), 0)", [subject, content]);
                      
            console.log('제목: ' + subject + ', 내용: '+ content);
            event_list(req, res);
        }
        else {
            console.log("내용을 전부 입력해주세요.");
        }
    });
}

exports.eventUpdate = function(req, res) {
    pool.getConnection(function(err, connection) {
        var id = req.param('event_id');

        var subject = req.param('subject');
        var content = req.param('content');

        if(subject && content) {
            
            console.log('제목: ' + subject + ', 내용: '+ content);

            connection.query('update event set subject=?, content=?, update_time=utc_timestamp() where event_id=?', 
                [subject, content, id],
            function(err, result) {
                console.log(id+'번 id번호가 수정되었습니다.');
                
                event_list(req, res); 
            });
        }
        else {
            console.log("내용을 전부 입력해주세요.");  
        }
    });
}

exports.eventDelete = function(req, res) {
    pool.getConnection(function(err, connection) {
        var id = req.param('event_id');

        connection.query('delete from event where coffee_id=?', id,
            function(err, result) {
            console.log(id+'번 id번호가 삭제되었습니다.');
            
            event_list(req, res);    
        });
    });
}

exports.eventUpdatePage = function(req, res) {
    pool.getConnection(function(err, connection) {
        var event_id = req.param('event_id');
        console.log(event_id);

        connection.query("select * from event where event_id = ?", event_id, function(err, result) {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            var context = {result: result};
            req.app.render('eventUpdate', context, function(err, html) {
                if(err) {throw err};
                res.end(html);
            });
        });
    });
}
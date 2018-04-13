var express = require('express');
var router = express.Router();
var connection;

router.post('/upload', function(req, res) {
    if(req.session.user) {
       
        var subject = req.param('subject');
        var content = req.param('content');

        if(subject && content) {
       
            connection.query("insert into event values(NULL, ?, ?, utc_timestamp(), utc_timestamp(), 0)", [subject, content]);
                      
            console.log('제목: ' + subject + ', 내용: '+ content);
            
            connection.query("select * from event", function(err, results) {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                
                var context = {results: results};
                req.app.render('eventList', context, function(err, html) {
                    if(err) {throw err};
                    res.end(html);
                });
            });   
        }
        else {
            console.log("내용을 전부 입력해주세요.");
            connection.query("select * from event", function(err, results) {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                
                var context = {results: results};
                req.app.render('eventList', context, function(err, html) {
                    if(err) {throw err};
                    res.end(html);
                });
            });
        }
    }
    else {
        res.redirect('/login.html');
    }
});

router.post('/update', function(req, res) {
    if(req.session.user) {
        var id = req.param('event_id');

        var subject = req.param('subject');
        var content = req.param('content');

        if(subject && content) {
            
            console.log('제목: ' + subject + ', 내용: '+ content);

            connection.query('update event set subject=?, content=?, update_time=utc_timestamp() where event_id=?', 
                [subject, content, id],
            function(err, result) {
                console.log(id+'번 id번호가 수정되었습니다.');
                
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
        else {
            console.log("내용을 전부 입력해주세요.");
            connection.query("select * from event", function(err, results) {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                
                var context = {results: results};
                req.app.render('eventList', context, function(err, html) {
                    if(err) {throw err};
                    res.end(html);
                });
            });    
        }
    }
    else {
        res.redirect('/login.html');
    }
});    

router.post('/delete', function(req, res) {
    if(req.session.user) {
        var id = req.param('event_id');

        connection.query('delete from event where coffee_id=?', id,
            function(err, result) {
            console.log(id+'번 id번호가 삭제되었습니다.');
            
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
    else {
        res.redirect('/login.html');
    }
});

router.get('/list', function(req, res) {
    if(req.session.user) {
        connection.query("select * from event", function(err, results) {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            
            var context = {results: results};
            req.app.render('eventList', context, function(err, html) {
                if(err) {throw err};
                res.end(html);
            });

        });
    }
    else {
        res.redirect('/login.html');
    }
});

router.get('/add', function(req, res) {
    if(req.session.user) {
        res.redirect('/eventAdd.html');
    } else {
        res.redirect('/login.html');
    }
});

router.get('/update_page' ,function(req, res) {
    if(req.session.user) {
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
    } else {
        res.redirect('/login.html');
    }
});

module.exports = router;
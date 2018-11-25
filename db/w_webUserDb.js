var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '#@tiqrhf#@',
    database: 'shuttlesDB'
});

var web_user_list = function(req, res) {
    var page_size = 10;
    var page_list_size = 10;
    var no = "";
    var totalPageCount = 0;
    
    pool.getConnection(function(err, connection) {
        
        connection.query("select count(*) as cnt from web_user", function(err, data) {
            if(err) {
                console.log(err);
                return;
            }
            else {
                totalPageCount = data[0].cnt;
                var curPage = req.param('page');

                if(totalPageCount < 0 ){
                    totalPageCount = 0;
                }

                if(!curPage || curPage < 1)
                    curPage = 1;

                var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
                var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
                var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
                var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
                var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


                //현재페이지가 0 보다 작으면
                if (curPage < 0) {
                    no = 0
                } else {
                //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
                    no = (curPage - 1) * 10
                }
                
                var result2 = {
                    "curPage": curPage,
                    "page_list_size": page_list_size,
                    "page_size": page_size,
                    "totalPage": totalPage,
                    "totalSet": totalSet,
                    "curSet": curSet,
                    "startPage": startPage,
                    "endPage": endPage
                };

            }

            connection.query("select * from web_user limit ?,?", [no, page_size], function(err, results) {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                connection.release();
                var context = {
                    results: results,
                    pasing: result2,
                };
    
                req.app.render('webUserList', context, function(err, html) {
                    if(err) {throw err};
                    res.end(html);
                });
            });

        });

    });
}

exports.webUserList = function(req, res) {
    web_user_list(req, res);
}

exports.webUserUpdateList = function(req, res) {
    var user_id = req.param('user_id');

    pool.getConnection(function(err, connection) {        
        connection.query("select * from market where user_id is NULL", function(err, result) {
            connection.release();

            var context = {
                results: result,
                u_id : user_id
            };

            req.app.render('webUserUpdate', context, function(err, html) {
                if(err) {throw err};
                res.end(html);
            });

        });
    });
}

exports.webUserUpdate = function(req, res) {
    var user_id = req.param('user_id');
    var market_id = req.param('market_id');
    var market_name = req.param('market_name');

    console.log(user_id + " / " + market_id+ " / " + market_name);

    pool.getConnection(function(err, connection) {        
        connection.query("update web_user set market_id=?, market_name=? where user_id=?", [market_id, market_name, user_id], function(err, result) {
            connection.query("update market set user_id=? where market_id=?", [user_id, market_id], function(err, result2) {
                if(err) {
                    console.log(err);
                }
                else {
                    connection.release();
                    web_user_list(req, res);  
                }
            });
        });
    });
}

exports.webUserDelete = function(req, res) {
    var id = req.param("user_id");
    console.log(id);
    pool.getConnection(function(err, connection) {
        connection.query("delete from web_user where user_id=?", [id], function(err, results) {
            connection.release();
            web_user_list(req, res);
        });
    });
}
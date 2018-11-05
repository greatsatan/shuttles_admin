var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '#@tiqrhf#@',
    database: 'shuttlesDB'
});

exports.summary = function(req, res) {
    var page_size = 10;
    var page_list_size = 10;
    var no = "";
    var totalPageCount = 0;

    pool.getConnection(function(err, connection) {
        var select_user = req.param("select_user");
        var startDate = req.param("startDate");
        var endDate = req.param("endDate");
        var curPage = req.param('page');
        var search = {
            "selectUser": select_user,
            "startDate": startDate,
            "endDate": endDate
        };
        var user;

        if(!startDate) {
            startDate = '1990-01-01';
        }
        if(!endDate) {
            endDate = '9999-12-31';
        }

        if(!select_user || select_user == 'all') {

            connection.query("select count(*) as cnt from orders where date BETWEEN ? AND ?", [startDate, endDate], function(err, data) {
                if(err) {
                    console.log(err);
                    return;
                }
                else {
                    totalPageCount = data[0].cnt;
   
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

                    connection.query("select * from user", [no, page_size], function(err, results) {
                        user = results;

                        connection.query("select * from orders where date BETWEEN ? AND ? limit ?,?", 
                        [startDate, endDate, no, page_size], function(err, results) {
                            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                            connection.release();
                            var context = {
                                results: results,
                                pasing: result2,
                                search: search,
                                user: user
                            };
                            req.app.render('summary', context, function(err, html) {
                                if(err) {throw err};
                                res.end(html);
                            });
                
                        });
                    });
                }
            });    
        }
        else {
            connection.query("select count(*) as cnt from orders where user_id=? AND date BETWEEN ? AND ?", [select_user, startDate, endDate], function(err, data) {
                if(err) {
                    console.log(err);
                    return;
                }
                else {
                    totalPageCount = data[0].cnt;

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

                    connection.query("select * from user", [no, page_size], function(err, results) {
                        user = results;

                        connection.query('select * from orders where user_id=? AND date BETWEEN ? AND ? limit ?,?', 
                            [select_user, startDate, endDate, no, page_size], function(err, results) {
                            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                            connection.release();
                            var context = {
                                results: results,
                                pasing: result2,
                                search: search,
                                user: user
                            };
                            req.app.render('summary', context, function(err, html) {
                                if(err) {throw err};
                                res.end(html);
                            });   
                        });
                    });
                }
            });    
        }
    });
}
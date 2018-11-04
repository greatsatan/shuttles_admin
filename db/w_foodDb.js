var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '#@tiqrhf#@',
    database: 'shuttlesDB'
});

var food_list = function(req, res) {
    pool.getConnection(function(err, connection) {
        var page_size = 10;
        var page_list_size = 10;
        var no = "";
        var totalPageCount = 0;
        var market_id = req.session.user.m_id;

        if(market_id == 0) {
            var market_id = req.param('mId');
        }

        connection.query("select count(*) as cnt from food where market_id=?", market_id, function(err, data) {
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
                
                connection.query("select * from market where market_id = ?", market_id, function(err, marketInfo) {
                    connection.query("select * from food where market_id=? order by food_id limit ?,?", [market_id, no, page_size], function(err, results) {
                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        var context = {
                            results: results,
                            pasing: result2,
                            mInfo: marketInfo
                        };
            
                        req.app.render('foodList', context, function(err, html) {
                            if(err) {throw err};
                            res.end(html);
                        });
            
                    });
                });
            }
        });        
    });
}

exports.foodList = function(req, res) {
    food_list(req, res);
}
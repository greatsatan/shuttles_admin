var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '#@tiqrhf#@',
    database: 'shuttlesDB'
});

var todayDrink_list = function(req, res) {
    var page_size = 10;
    var page_list_size = 10;
    var no = "";
    var totalPageCount = 0;

    pool.getConnection(function(err, connection) {

        connection.query("select count(*) as cnt from coffee_list where today_menu=1", function(err, data) {
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

                connection.query("select * from coffee_list where today_menu=1 order by coffee_id limit ?,?",[no, page_size], function(err, results) {
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                    connection.release();
                    var context = {
                        results: results,
                        pasing: result2
                    };
        
                    req.app.render('todayDrinkList', context, function(err, html) {
                        if(err) {throw err};
                        res.end(html);
                    });
        
                });
            }
        });

        

    });
}

exports.todayDrinkList = function(req, res) {
    todayDrink_list(req, res);
}

exports.todayDrinkAdd = function(req, res) {
    var id = req.param('coffee_id');
    var price = parseInt(req.param('price'));

    pool.getConnection(function(err, connection) {
        connection.query('update coffee set today_menu=1 where coffee_id=?', id, function(err, result) {
            if(err) {
                console.log(err);
            }  
            else {          
                connection.query("update coffee_size set today_price=? where coffee_id=?", [price, id], function(err, result) {
                    connection.release();
                    todayDrink_list(req, res);  
                });
            }
        });
    });
}

exports.todayDrinkUpdate = function(req, res) {
    var id = req.param('todayDrink_id');
    var price = parseInt(req.param('price'));

    console.log(id + " / " + price);

    pool.getConnection(function(err, connection) {        
        connection.query("update coffee_size set today_price=? where coffee_id=?", [price, id], function(err, result) {
            connection.release();
            todayDrink_list(req, res);  
        });
    });
}

exports.todayDrinkDelete = function(req, res) {
    var id = req.param("todayDrink_id");
    console.log(id);
    pool.getConnection(function(err, connection) {
        connection.query("call today_menu_del(?)", [id], function(err, results) {
            connection.release();
            todayDrink_list(req, res);
        });
    });
}
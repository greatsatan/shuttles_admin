var mysql = require('mysql');
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
                        connection.release();
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

exports.foodUpload = function(req, res) {
    var file = req.file;
    var name = req.param('food_name');
    var price = req.param('food_price');
    var description = req.param('food_description');
    var market_id = req.session.user.m_id;

    console.log(name + "/ " + price + " / "  + market_id);
    
    if(market_id==0) {
        food_list(req, res);
    }

    if(file && name && price) {
        var option_length = 0;
        var filename = file.originalname;
        var picture_url = imagePath+filename;

        pool.getConnection(function(err, connection) {
            connection.query("insert into food values(NULL, ?, ?, 1, ?, ?, ?, 0)", [name, picture_url, market_id, description, price],
            function(err, result) {
                var insertId = result.insertId;
                console.log("id: " + insertId);
                connection.release();

                var menuImg = './uploads/'+filename;
                jimp.read(menuImg, function(err, img) {
                    img.resize(200, 200).write(menuImg, function(err) {
                        param.Key = filename;
                        param.Body = fs.createReadStream(menuImg);
                            
                        s3.upload(param, function(err, data) {
                            if(err) {
                                console.log(err);
                            }
                            else {
                                console.log(data);
                                food_list(req, res);
                            }
                        });
                    })
                });
            });
        });
    }
    else {
        console.log("내용을 전부 입력해주세요.");
    }
    
};

exports.foodList = function(req, res) {
    food_list(req, res);
}

exports.foodUpdate = function(req, res) {
    var id = req.param('food_id');
    var file = req.file;

    var name = req.param('food_name');
    var price = req.param('food_price');
    var description = req.param('food_description');
    var market_id = req.session.user.m_id;

    if(name && price) {
        if(file) {
            var filename = file.originalname;
            var mimetype = file.mimetype;
            var size = file.size;
            var picture_url = imagePath+filename; 

            pool.getConnection(function(err, connection) {
                connection.query('select picture_version from food where food_id = ?', id,
                function(err, version) {
                    var ver = version[0].picture_version+1;
                    
                    connection.query('update food set name=?, picture_url=?, picture_version=?, description=?, price=? where food_id=?', 
                        [name,  picture_url, ver, description, price, id],
                    function(err, result) {
                        console.log(id+'번 id번호가 수정되었습니다.');
                        connection.release();
    
                        var menuImg = './uploads/'+filename;
                        jimp.read(menuImg, function(err, img) {
                            img.resize(200,200).write(menuImg, function(err) {
                                param.Key = filename;
                                param.Body = fs.createReadStream(menuImg);
                                    
                                s3.upload(param, function(err, data) {
                                    if(err) {
                                        console.log(err);
                                    }
                                    else {
                                        console.log(data);
                                        food_list(req, res); 
                                    }
                                });
                            });
                        }).catch(function(err) {
                            console.log(err);       
                        });
                    });
            
                });
            });


        }
        else {
            pool.getConnection(function(err, connection) {
                connection.query('update food set name=?, description=?, price=? where food_id=?', 
                        [name, description, price, id],
                function(err, result) {
                    connection.release();
                    console.log(id+'번 id번호가 수정되었습니다.');
                    food_list(req, res); 
                });
            });
        }
    }
    else {
        console.log("내용을 전부 입력해주세요.");
    }
}

exports.foodDelete = function(req, res) {
    var id = req.param('food_id');
    pool.getConnection(function(err, connection) {
        connection.query('delete from food where food_id=?', id, function(err, result) {
            connection.release();
            console.log(id+'번 id번호가 삭제되었습니다.');
            
            food_list(req, res);     
        });
    });
}

exports.foodUpdatePage = function(req, res) {
    var food_id = req.param('food_id');

    pool.getConnection(function(err, connection) {
        connection.query("select * from food where food_id = ?", food_id, function(err, result) {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            connection.release();
            var context = {result: result};
            var pathLen = imagePath.length;
            var picture_url = result[0].picture_url;
            if(picture_url) {
                result[0].picture_url = picture_url.substring(pathLen, picture_url.length);
            }
            else {
                result[0].picture_url = "등록된사진없음";
            }
            req.app.render('foodUpdate', context, function(err, html) {
                if(err) {throw err};
                res.end(html);
            });

        });
    });
}

exports.foodSoldout = function(req, res) {
    var id = req.param('food_id');
    var state = req.param('food_state');
    var bState = (state == 0)?true:false;

    pool.getConnection(function(err, connection) {
        connection.query('update food set food_state=? where food_id=?', [bState, id], function(err, result) {
            connection.release();    
            console.log(id+'번 판매상태 변경되었습니다.');
            
            food_list(req, res);     
        });
    });
}

exports.foodShop = function(req, res) {
    var state = req.param('market_state');
    var market_id = req.session.user.m_id;
    state = (state==0)?1:0;
    
    pool.getConnection(function(err, connection) {
        connection.query('update market set market_state=? where market_id=?', [state, market_id], function(err, result) {
            connection.release();
            food_list(req, res);     
        });
    });
}
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

exports.dbConnect = function(data, callback) {
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log(err);
        }
        console.log('connect');
        callback(data);
    })
};

var coffee_list = function(req, res) {
    var page_size = 10;
    var page_list_size = 10;
    var no = "";
    var totalPageCount = 0;

    pool.getConnection(function(err, connection) {

        connection.query("select count(*) as cnt from coffee_list", function(err, data) {
            if(err) {
                console.log(err);
                return;
            }
            else {
                totalPageCount = data[0].cnt;
                var curPage = req.param('page');

                console.log("현재페이지 : " + curPage + " 전체페이지: " + totalPageCount);
                

                if(totalPageCount < 0 ){
                    totalPageCount = 0;
                }

                if(!curPage)
                    curPage = 0;

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

                console.log('[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)
                console.log(no + " / " + page_size);
                
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

                connection.query("select * from coffee_list order by coffee_id desc limit ?,?", [no, page_size], function(err, results) {
                    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        
                    var context = {
                        results: results,
                        pasing: result2
                    };
                    var length = results.length;
                    var pathLen = imagePath.length;
        
                    req.app.render('menuList', context, function(err, html) {
                        if(err) {throw err};
                        res.end(html);
                    });
        
                });

            }
        });

        
    });
}

exports.coffeeList = function(req, res) {
    coffee_list(req, res);
}

exports.coffeeUpload = function(req, res) {
    var file = req.file;

    var name = req.param('coffee_name');
    var coffee_size = req.param('coffee_size');
    var kind = req.param('coffee_kind');
    var option_name = req.param('option_name');
    var price = req.param('coffee_price');
    var option_price = req.param('option_price');
    var description = req.param('coffee_description');

    if(file && name && coffee_size && kind && price) {
        var option_length = 0;
        var filename = file.originalname;
        var picture_url = imagePath+filename;

        if(!option_name || !option_price) {
            option = '없음';
            option_price = 0;
        }
        else {
            option_length = option_name.length-1;
        }

        pool.getConnection(function(err, connection) {
            connection.query("insert into coffee values(NULL, ?, ?, ?, 1, 0)", [name, picture_url, description],
            function(err, result) {
                var insertId = result.insertId;
                console.log("id: " + insertId);
                connection.query("insert into coffee_size values(NULL, ?, ?, ?, 0)", [coffee_size, price, insertId]);
                connection.query("insert into coffee_state values(NULL, ?, ?)", [kind, insertId]);
                for(var idx=0; idx<option_length;idx++) {
                    connection.query("insert into coffee_option values(NULL, ?, ?, ?)", [option_name[idx], option_price[idx], insertId], function(err, result) {
                    
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
                                        coffee_list(req, res);
                                    }
                                });
                            });
                        }).catch(function(err) {
                            console.log(err);       
                        });
                    });
                }
            });
        });

    }
    else {
        console.log("내용을 전부 입력해주세요.");
    }
    
};

exports.coffeeUpdate = function(req, res) {
    var id = req.param('coffee_id');
    var file = req.file;

    var name = req.param('coffee_name');
    var coffee_size = req.param('coffee_size');
    var kind = req.param('coffee_kind');
    var option_name = req.param('option_name');
    var price = req.param('coffee_price');
    var option_price = req.param('option_price');
    var description = req.param('coffee_description');
    var option_id = req.param('option_id');

    console.log(file + name + coffee_size + kind + price);

    if(name && coffee_size && kind && price) {
        var option_len = 0;
        var option_update_len = 0;
        var option_ins = 0;
        var option_del = 0;

        if(!option_name || !option_price) {
            option_name = '없음';
            option_price = 0;
        }
        else {
            option_len = option_id.length;
            option_update_len = option_name.length-1;
            if(option_len < option_update_len) {
                option_ins = 1;
            }
            else if(option_len > option_update_len) {
                option_del = 1;
            }
        }  

        pool.getConnection(function(err, connection) {
            if(option_ins==1) {
                for(var idx=0; idx<option_len; idx++) {
                    connection.query('update coffee_option set name=?, price=? where option_id=?', [option_name[idx], option_price[idx], option_id[idx]]);
                }
                for(var idx=option_len; idx<option_update_len; idx++) {
                    connection.query("insert into coffee_option values(NULL, ?, ?, ?)", [option_name[idx], option_price[idx], id]);
                }
            }
            else if(option_del==1) {
                connection.query('delete from coffee_option where coffee_id = ?', id);
                for(var idx=0; idx<option_update_len; idx++) {   
                    connection.query("insert into coffee_option values(NULL, ?, ?, ?)", [option_name[idx], option_price[idx], id]);
                }
            }
            else {
                for(var idx=0; idx<option_len; idx++) {
                    connection.query('update coffee_option set name=?, price=? where option_id=?', [option_name[idx], option_price[idx], option_id[idx]]);
                }
            }
        });

        if(file) {
            var filename = file.originalname;
            var mimetype = file.mimetype;
            var size = file.size;
            var picture_url = imagePath+filename; 

            pool.getConnection(function(err, connection) {
                connection.query('select picture_version from coffee where coffee_id = ?', id,
                function(err, version) {
                    var ver = version[0].picture_version+1;
                    
                    connection.query('call coffee_update(?, ?, ?, ?, ?, ?, ?, ?)', 
                        [id, name,  picture_url, description, ver, coffee_size, price, kind],
                    function(err, result) {
                        console.log(id+'번 id번호가 수정되었습니다.');
    
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
                                        coffee_list(req, res); 
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
                connection.query('call coffee_update2(?, ?, ?, ?, ?, ?)', 
                    [id, name, description, coffee_size, price, kind],
                function(err, result) {
                    console.log(id+'번 id번호가 수정되었습니다.');
                    coffee_list(req, res); 
                });
            });
        }
    }
    else {
        console.log("내용을 전부 입력해주세요.");
    }
};


exports.coffeeDelete = function(req, res) {
    var id = req.param('coffee_id');
    pool.getConnection(function(err, connection) {
        connection.query('delete from coffee where coffee_id=?', id,
            function(err, result) {
            console.log(id+'번 id번호가 삭제되었습니다.');
            
            coffee_list(req, res);     
        });
    });
}

exports.coffeeUpdatePage = function(req, res) {
    var coffee_id = req.param('coffee_id');
    console.log(coffee_id);

    pool.getConnection(function(err, connection) {
        connection.query("select * from coffee_update_list where coffee_id = ?", coffee_id, function(err, result) {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            var context = {result: result};
            var pathLen = imagePath.length;
            var picture_url = result[0].picture_url;
            if(picture_url) {
                result[0].picture_url = picture_url.substring(pathLen, picture_url.length);
            }
            else {
                result[0].picture_url = "등록된사진없음";
            }
            req.app.render('menuUpdate', context, function(err, html) {
                if(err) {throw err};
                res.end(html);
            });

        });
    });
}

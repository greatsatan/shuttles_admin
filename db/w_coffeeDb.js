var mysql = require('mysql');
var jimp = require('jimp');
var AWS = require('aws-sdk');
var fs = require('fs');
AWS.config.update({
    accessKeyId: "AKIAIEA5ZWNRSQHU55UA",
    secretAccessKey: "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",
    "region": "ap-northeast-2"
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
    password: '1234',
    database: 'shuttlesdb'
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
    pool.getConnection(function(err, connection) {
        connection.query("select * from coffee_list", function(err, results) {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            
            var context = {results: results};
            req.app.render('menuList', context, function(err, html) {
                if(err) {throw err};
                res.end(html);
            });

        });
    });
}

exports.coffeeList = function(req, res) {
    coffee_list(req, res);
}

exports.coffeeUpload = function(req, res) {
    var file = req.file;
    console.log(file);

    var name = req.param('coffee_name');
    var coffee_size = req.param('coffee_size');
    var kind = req.param('coffee_kind');
    var option_name = req.param('option_name');
    var price = req.param('coffee_price');
    var option_price = req.param('option_price');
    var description = req.param('coffee_description');

    if(file && name && coffee_size && kind && price && description) {
        var option_length = 0;
        var filename = file.originalname;
        var mimetype = file.mimetype;
        var size = file.size;
        var picture_url = imagePath+filename;

        if(!option_name || !option_price) {
            option = '없음';
            option_price = 0;
        }
        else {
            option_length = option_name.length-1;
        }

        pool.getConnection(function(err, connection) {
            connection.query("insert into coffee values(NULL, ?, ?, ?, 1)", [name, picture_url, description],
            function(err, result) {
                var insertId = result.insertId;
                console.log("id: " + insertId);
                connection.query("insert into coffee_size values(NULL, ?, ?, ?)", [coffee_size, price, insertId]);
                connection.query("insert into coffee_state values(NULL, ?, ?)", [kind, insertId]);
                for(var idx=0; idx<option_length;idx++) {
                    connection.query("insert into coffee_option values(NULL, ?, ?, ?)", [option_name[idx], option_price[idx], insertId]);
                }
            });
        });

        var menuImg = './uploads/'+filename;

        jimp.read(menuImg).then(function(img) {
            img.resize(70,70).write(menuImg);
        }).catch(function(err) {
            console.log(err);
        });

        param.Key = filename;
        param.Body = fs.createReadStream(menuImg);

        /*s3.upload(param, function(err, data) {
            if(err) {
                console.log(err);
            }
            else {
                console.log(data);
            }
        });*/

        console.log(picture_url);

        console.log('메뉴 이름: ' + name + ', 사이즈: '+ coffee_size + ', 구분: ' + kind + ', 옵션: ' + option_name + ', description: ' + description);
        console.log('현재 파일 정보 : ' + filename + ', ' + mimetype + ', ' + size);
        
    }
    else {
        console.log("내용을 전부 입력해주세요.");
    }
    coffee_list(req, res);
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

    if(file && name && coffee_size && kind && price && description) {
        var option_len = 0;
        var option_update_len = 0;
        var option_ins = 0;
        var option_del = 0;
        filename = file.originalname;
        mimetype = file.mimetype;
        size = file.size;    

        if(!option_name || !option_price) {
            option_name = '없음';
            option_price = 0;
        }
        else {
            option_len = option_id.length;
            option_update_len = option_name.length-1;
            console.log("기존: "+option_len);
            console.log("변경: "+option_update_len);
            if(option_len < option_update_len) {
                option_ins = 1;
            }
            else if(option_len > option_update_len) {
                option_del = 1;
            }
        }   

        pool.getConnection(function(err, connection) {
            connection.query('select picture_version from coffee where coffee_id = ?', id,
            function(err, version) {
                var ver = version[0].picture_version+1;
                
                connection.query('call coffee_update(?, ?, ?, ?, ?, ?, ?, ?)', 
                    [id, name,  filename, description, ver, coffee_size, price, kind],
                function(err, result) {
                    console.log(id+'번 id번호가 수정되었습니다.');
                });
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
        });
    }
    else {
        console.log("내용을 전부 입력해주세요.");
    }
    coffee_list(req, res);  
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
        connection.query("select * from coffee_list where coffee_id = ?", coffee_id, function(err, result) {
            res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
            var context = {result: result};
            req.app.render('menuUpdate', context, function(err, html) {
                if(err) {throw err};
                res.end(html);
            });

        });
    });
}
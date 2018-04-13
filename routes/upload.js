var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
});

var upload = multer({
    limits : {
        files: 1,
        filesSize : 1024*1024
    },
    storage : storage
});

module.exports = upload;
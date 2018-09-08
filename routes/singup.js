var express = require('express');
var router = express.Router();
var db = require('../db/w_signupDb');

router.post('/', function(req, res) {
  db.signup(req, res);
});

module.exports = router;
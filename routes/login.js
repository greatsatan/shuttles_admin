var express = require('express');
var router = express.Router();
var db = require('../db/w_loginDb');

router.post('/', function(req, res) {
  console.log('login middleware');

  db.login(req, res);
});

router.get('/logout', function(req, res){ 
  if(req.session.user) {
      req.session.destroy(function(err) {
          if(err) {throw err;}
          console.log('session delete and logout');
          res.redirect('/login.html');
      })
  }
  else {
      res.redirect('/login.html');
  }
});

module.exports = router;

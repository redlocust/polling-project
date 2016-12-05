var express = require("express");
var passport = require("passport");
var User = require("./models/user");

var router = express.Router();
module.exports = router;

router.get('/login', function(req, res){
  res.render('login');
});


router.post('/login',
  passport.authenticate('local',
    {
      successRedirect: '/',
      failureRedirect: '/auth/login'
    }
  )
);

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect("/");
});

router.get('/twitter',
  passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.

    res.redirect('/');
  });
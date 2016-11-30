var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user');



passport.use(new LocalStrategy(
  function (username, password, done) {

    User.findOne({username: username}, function (err, user) {
      if (err) {
        return done(err);
      }

      console.log(user);

    });

    User.findOne({username: username}, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {message: 'Incorrect username.'});
      }
      if (user.password != password) {
        return done(null, false, {message: 'Invalid password'});
      }
      console.log("login");
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done){
  done(null, user._id);
});
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    if(err || !user) return done(err, null);
    done(null, user);
  });
});
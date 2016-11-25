var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user');

passport.use(new LocalStrategy(
  function (username, password, done) {

    User.findOne({"username": "123"}, function (err, user) {
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
      return done(null, user);
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
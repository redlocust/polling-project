var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy;

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



passport.use(new TwitterStrategy({
    consumerKey: "Vhjg3SqSp5SNzABW9aDWVRDmC",
    consumerSecret: "LOr1WKkvusbAO71k7w0XSh3AEPGKlpWXuKrvBlqvvsoviEkVYQ",
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
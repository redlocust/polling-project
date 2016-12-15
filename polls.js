var express = require("express");

var Polls = require("./models/polls");
var User = require("./models/user");

var router = express.Router();
module.exports = router;

router.get('/polls', function (req, res) {

  var admin = false;

  if (typeof req.user !== "undefined") admin = req.user.admin;

  Polls.find({}, function (err, polls) {
    if (err) throw err;

    res.render('poll-list', {
      "polls": polls,
      "admin": admin
    });

  });

});

router.get("/polls/mypolls", function (req, res) {

  Polls.find({"authorId": req.user._id}, function (err, polls) {
    if (err) throw err;

    res.render('poll-list', {
      "polls": polls,
      "canDelete": true
    });

  });

});

router.get('/polls/:id', function (req, res) {

  var id = req.params.id;

  Polls.findOne({"id": id}, function (err, poll) {
    if (err) throw err;

    res.render('poll-item', {
      "poll": poll,
      "url": req.protocol + '://' + req.get('host') + req.originalUrl
    });
  });

});


router.post('/polls/:id', function (req, res) {

  var id = req.params.id;

  var ip = (req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress).split(",")[0];

  //console.log(ip);

  var userId;

  if (typeof req.user !== 'undefined') {
    userId = (req.user.id) || (req.user._id);
  } else {
    userId = ip;
  }

  //console.log("userID " + userId);

  Polls.findOne({"id": id}, function (err, poll) {
    if (err) throw err;

    var doublePolling = false;
    var choises = poll.answers;
    choises.forEach(function (choice) {
      if (choice.label === req.body.choice) {
        poll.markModified('answers');
        choice.count = choice.count + 1;

        /// Find user's choice, second polling is restricted

        var arr = choice.userChoices;
        var isFind = false;


        //console.log(req.session.id);

        if (arr.length > 0) {
          isFind = arr.find(function (elem) {
            return elem == userId;
          });
        }

        if (isFind) {
          doublePolling = true;

        } else {
          choice.userChoices.push(userId)
        }
      }

    });


    if (!doublePolling) {
      poll.save(function (err) {
        if (err) throw err;

        console.log('Poll successfully updated!');
        res.redirect('/polls/' + id);
      });
    } else {
      res.render('error',
        {
          error: "already polling"
        });
    }

  });

});

router.get('/polls/add-choice/:id', function (req, res) {

  var id = req.params.id;

  Polls.findOne({"id": id}, function (err, poll) {
    if (err) throw err;

    res.render('add-choice', {
      "poll": poll
    });
  });

});

router.post('/polls/add-choice/:id', function (req, res) {

  var id = req.params.id;

  Polls.findOne({"id": id}, function (err, poll) {
    if (err) throw err;

    console.log(poll);

    var answer = {
      label: req.body.question,
      count: 0,
      userChoices: []
    };

    poll.markModified('answers');

    poll.answers.push(answer);

    poll.save(function (err) {
      if (err) throw err;

      console.log('Poll successfully updated!');
      res.redirect('/polls/' + id);
    });

  });
});

router.get('/polls/del-choice/:id/:num', function (req, res) {

  var id = req.params.id;
  var num = req.params.num;

  Polls.findOne({"id": id}, function (err, poll) {
    if (err) throw err;

    poll.markModified('answers');

    poll.answers.splice(num, 1);

    poll.save(function (err) {
      if (err) throw err;

      console.log('Poll successfully updated!');
      res.redirect('/admin/edit/' + id);
    });

  });

});
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
      "polls": polls
    });

  });

});

router.get('/polls/:id', function (req, res) {

  var id = req.params.id;

  Polls.findOne({"id": id}, function (err, poll) {
    if (err) throw err;

    res.render('poll-item', {
      "poll": poll
    });
  });

});


router.post('/polls/:id', function (req, res) {

  var id = req.params.id;
  var doublePolling;

  Polls.findOne({"id": id}, function (err, poll) {
    if (err) throw err;

    var choises = poll.answers;
    choises.forEach(function (choice) {
      if (choice.label === req.body.choice) {
        poll.markModified('answers');
        choice.count = choice.count + 1;

        /// Find user's choice, second polling is restricted

        var arr = choice.userChoices;
        var isFind = false;

        if (arr.length > 0) {
          isFind = arr.find(function (elem) {
            return elem === req.user._id;
          });
        }

        if (!isFind) {
          choice.userChoices.push(req.user._id)
        } else {
          doublePolling = true;
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
                    error : "alread polling"
                  });
    }

  });

});
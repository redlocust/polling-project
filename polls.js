var express = require("express");

var Polls = require("./models/polls");

var router = express.Router();
module.exports = router;

router.get('/polls', function (req, res) {

  Polls.find({}, function (err, polls) {
    if (err) throw err;

    res.render('poll-list', {
      "polls": polls
    });

  });

});

router.get('/polls/:id', function (req, res) {

  var id = req.params.id;

  Polls.find({"id": id}, function (err, polls) {
    if (err) throw err;

    var poll = polls[0];

    res.render('poll-item', {
      "poll": poll
    });
  });

});


router.post('/polls/:id', function (req, res) {

  var id = req.params.id;

  Polls.findOne({"id": id}, function (err, poll) {
    if (err) throw err;

    var choises = poll.answers;
    choises.forEach(function (choice) {
      if (choice.label === req.body.choice) {
        poll.markModified('answers');
        choice.count = choice.count + 1;
      }
    });

    poll.save(function (err) {
      if (err) throw err;

      console.log('Poll successfully updated!');
    });

    res.redirect('/polls/' + id);

  });

});
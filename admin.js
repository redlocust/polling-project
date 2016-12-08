var express = require("express");
var Polls = require("./models/polls");
var uuid4 = require("node-uuid");
var TMClient = require('textmagic-rest-client');

var router = express.Router();
module.exports = router;

router.get("/add", require('connect-ensure-login').ensureLoggedIn('/auth/login'), function (req, res) {
  res.render('add-poll');
});

router.post('/add', function (req, res) {

  var uuid = uuid4();
  var question = req.body.question;
  var answers = req.body.answers;
  //Need to parse answers string from textarea "/r/n"

  answers = answers.split('\r\n');
  answers = answers.map(function (elem) {
    return {
      "label": elem,
      "count": 0,
      "userChoices": []
    }
  });

  var newPoll = Polls({
    "id": uuid,
    "question": question,
    "answers": answers,
    "authorId": req.user._id

  });

  newPoll.save(function (err) {
    if (err) throw err;

    var c = new TMClient('alexred', '7uuYXTPgUHgBNZIZmTOv0bII19qJ2S');
    c.Messages.send({
      text: question,
      phones: '+79202756885'
    }, function (err, res) {
      console.log('Messages.send()', err, res);
    });

    console.log('Poll created!');
  });

  res.redirect('/polls/' + uuid);

});

router.get('/delete/:idPoll', function (req, res) {

  var idPoll = req.params.idPoll;

  Polls.findOne({"id": idPoll}, function (err, poll) {
    if (err) throw err;

    poll.remove(function (err) {
      if (err) throw err;
      console.log("Poll delete");
    });
  });

  res.redirect('/polls');
});
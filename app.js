var express = require('express');
//require('bootstrap')
var app = express();

var polls = require('./data/polls.json');

app.set('view engine', 'jade');

app.use(express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use(express.static(__dirname + '/node_modules/jquery/dist/'));

app.get('/', function (req, res) {
  res.redirect('/polls');
});



app.get('/polls', function (req, res) {
  res.render('poll-list', {
    "text" : "text text",
    "polls": polls
  });
});



app.get('/polls/:id', function (req, res) {

  var poll;
  var id = req.params.id;

  polls.forEach(function (elem) {
    if (elem.id === id) {
      poll = elem;
    }
  });

  res.render('poll-item', {
    "text": "text text",
    "poll": poll
  });
});



app.listen(3000);
console.log('server starts at http://localhost:3000');
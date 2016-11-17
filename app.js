//TODO Crit Add MongoDB
//TODO Crit Passport support
//TODO Crit Добавить сохранение выборов
//TODO Crit Авторизация через Твиттер

//TODO Err Не работает вид элемента
//TODO Err Диаграмма работает только с двумя выборами
//TODO Err Добавить пробел в поле с описанием в списке голосований
//TODO Err Сделать инициализацию. Чтобы было хотя бы одно голосование

//TODO Enhan Добавить React или Angular
//TODO Удаление голосований
//TODO Обработка ошибок в URL (404)

var express = require('express');
//require('bootstrap')
var app = express();

var bodyParser = require("body-parser");
//var polls = require('./data/polls.json');

var Polls = require("./mongoose.js");

var uuid4 = require("node-uuid");

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use(express.static(__dirname + '/node_modules/jquery/dist/'));


app.get('/', function (req, res) {

  // var newPoll = Polls({
  //   "id": "000000000001111",
  //   "question": "question",
  //   "answers": [
  //     {"label": 555, "count": 5},
  //     {"label": 333, "count": 6}
  //   ]
  // });

  // newPoll.save(function (err) {
  //   if (err) throw err;
  //
  //   console.log('Poll created!');
  // });

  res.redirect('/polls');
});


app.get('/polls', function (req, res) {

  //var polls = [];

  Polls.find({}, function (err, polls) {
    if (err) throw err;

    res.render('poll-list', {
      "polls": polls
    });

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
    "poll": poll
  });
});


app.post('/polls/:id', function (req, res) {

  var poll;
  var id = req.params.id;

  polls.forEach(function (elem) {
    if (elem.id === id) {

      poll = elem;

      var choises = elem.answers;
      choises.forEach(function (choice) {
        if (choice.label === req.body.choice) {
          choice.count = choice.count + 1;
        }
      })
    }
  });

  res.render('poll-item', {
    "poll": poll
  });
});


app.get('/add-poll', function (req, res) {
  res.render('add-poll');
});


app.post('/add-poll', function (req, res) {

  var uuid = uuid4();
  var question = req.body.question;
  var answers = req.body.answers;
  //Need to parse answers string from textarea "/r/n"

  answers = answers.split('\r\n');
  answers = answers.map(function (elem) {
    return {
      "label": elem,
      "count": 0
    }
  });


  var newPoll = Polls({
    "id": uuid,
    "question": question,
    "answers": answers
  });

  newPoll.save(function (err) {
    if (err) throw err;

    console.log('Poll created!');
  });

  res.redirect('/polls/' + uuid);

});


app.listen(3000);
console.log('server starts at http://localhost:3000');
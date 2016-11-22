//DO Crit Add MongoDB
//TODO Crit Passport support
//TODO Crit Добавить сохранение выборов для пользователя
//TODO Crit Авторизация через Твиттер

//DO Err Не работает вид элемента
//DO Err Диаграмма работает только с двумя выборами
//DO Err Добавить пробел в поле с описанием в списке голосований
//TODO Err Сделать инициализацию. Чтобы было хотя бы одно голосование
//TODO Err Проверить на ошибки ввода

//TODO Enhan Добавить React или Angular
//DO Удаление голосований
//TODO Обработка ошибок в URL (404)

var express = require('express');
//require('bootstrap')
var app = express();

var bodyParser = require("body-parser");
//var polls = require('./data/polls.json');

var Polls = require("./models/polls");

var uuid4 = require("node-uuid");

var passport = require('passport');

var session = require('express-session');

//var configDB = require('./config/database.js');

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use(express.static(__dirname + '/node_modules/jquery/dist/'));


// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.get('/', function (req, res) {

  res.redirect('/polls');
});


app.get('/polls', function (req, res) {

  Polls.find({}, function (err, polls) {
    if (err) throw err;

    res.render('poll-list', {
      "polls": polls
    });

  });

});


app.get('/polls/:id', function (req, res) {

  var id = req.params.id;

  Polls.find({"id": id}, function (err, polls) {
    if (err) throw err;

    var poll = polls[0];

    res.render('poll-item', {
      "poll": poll
    });
  });

});


app.post('/polls/:id', function (req, res) {

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

app.get('/polls/delete/:idPoll', function (req, res) {

  var idPoll = req.params.idPoll;

  Polls.findOne({"id": idPoll}, function (err, poll) {
    if(err) throw err;

    poll.remove(function (err) {
      if(err) throw err;
      console.log("Poll delete");
    });
  });

  res.redirect('/polls');
});


app.get('/login', function(req, res) {
  res.send('Go back and register!');
});


// routes ======================================================================
  require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


app.listen(3000);
console.log('server starts at http://localhost:3000');
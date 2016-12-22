//DO Crit Add MongoDB
//DO Crit Passport support
//DO Crit Добавить сохранение выборов для пользователя без аутентификации
//DO Crit Добавить возможность делиться выбором в Твиттере
//DO Crit Авторизация через Твиттер
//DO Crit Список голосований созданных пользователем
//DO Crit Удалять можно только свои голосования
//DO As an authenticated user, I can share my polls with my friends.
//TODO As an authenticated user, I can see the aggregate results of my polls
//DO Свои голосований можно менять, добавлять новые пункты
//TODO Можно менять только свои голосования, пока можно всем

//DO Err Не работает вид элемента
//DO Err Диаграмма работает только с двумя выборами
//DO Err Добавить пробел в поле с описанием в списке голосований
//TODO Err Сделать инициализацию. Чтобы было хотя бы одно голосование
//TODO Err Проверить на ошибки ввода
//DO Err Не работает голосование с локальной авторизацие при добавлении нового пункта
//DO Err Не работает удаление голосований из списка своих голосований
//TODO Err Не работает Update Poll

//TODO Enhan Добавить React или Angular
//DO Удаление голосований
//TODO Обработка ошибок в URL (404)
//TODO Пока аутентификация неавторизованных пользователей идет по IP, этого недостаточно

var express = require('express');

var mongoose = require("mongoose");
mongoose.connect("mongodb://mongo/polling");

var User = require("./models/user");

var passport = require('passport');


var bodyParser = require("body-parser");

require("./auth-init");

var app = express();
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'jade');

app.use(express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use(express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use('/', function(err, req, res, next) {
  res.send(err.message);
});


app.get('/', function (req, res) {
  res.redirect('/polls');
});

var authRouter = require("./auth");
app.use('/auth',authRouter);

var pollsRouter = require('./polls');
app.use(pollsRouter);

var adminRouter = require('./admin');
app.use('/admin', adminRouter);



app.listen(3000);
console.log('server starts at http://127.0.0.1:3000');

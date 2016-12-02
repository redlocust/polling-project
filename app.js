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

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/polling");

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

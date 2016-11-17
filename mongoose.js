var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/polling");

var Schema = mongoose.Schema;

var pollSchema = new Schema(
  {
    id: String,
    question: String,
    answers: Array
  }
);

var Polls = mongoose.model('Polls', pollSchema);

module.exports = Polls;

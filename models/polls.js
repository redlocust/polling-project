var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var pollSchema = new Schema(
  {
    id: String,
    question: String,
    answers: Array,
    userId: String
  }
);

var Polls = mongoose.model('Polls', pollSchema);

module.exports = Polls;
